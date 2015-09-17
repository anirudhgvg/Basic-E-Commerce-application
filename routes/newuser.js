
exports.loadPostLoginpage = function (req, res) {
    
    console.log("User credentials obtained");
    var usr = req.body.username;
    var pass = req.body.pwd;
    
    var ses = req.session;
    ses.user = usr;
    console.log(ses.user + 'has initiated LOGIN request');
    
    var renderUserOrAdmin = function (err, rows, fields) {
        if (!err) {
            if (rows.length > 0) {
                if (rows[0].adminflag == 1) {
                    ses.admin = true;
                    console.log(ses.user + 'Admin Login Successful');
                    res.render('adminHomepage');
                }   
                else if (pass == rows[0].pwd) {
                    console.log(ses.user + 'User Login Successful');
                    res.render('loggedUser');
                }
                else {
                    console.log(ses.user + 'Login unsuccessful');
                    res.render('login', { errMsg: 'Username and password combination was not correct' });
                }
            }
            else {
                console.log(ses.user + 'Login unsuccessful');
                res.render('login', { errMsg: 'Username and password combination was not correct' });
            }
        }
        else {
            console.log('Error while performing login Query.' + err);
            res.render('login', { errMsg: err });
        }
    }

    var mysql = require('./mysql.js').pool;
    
    mysql.getConnection(function (err, conn) {
        conn.query("select * from users where uname=?", usr, renderUserOrAdmin);
        conn.release();
    })
};

exports.loadPostRegisterpage = function (req, res) {
    var mysql = require('./mysql.js').pool;
    
    console.log("Signup request received");
    var fname = req.body.fname;
    var lname = req.body.lname;
    var add = req.body.add;
    var cty = req.body.cty;
    var st = req.body.st;
    var zp = req.body.zp;
    var emailid = req.body.emailid;
    var uname = req.body.uname;
    var pwd = req.body.pwd;

    var checkInput = function () {
        var verified = 0;
        if (!(/^[a-zA-Z]+$/.test(fname))) {
            res.render('signup', { errMsg: "First name can contain only alphabets", fname: "", lname: lname, add: add, cty: cty, zp: zp, emailid: emailid, uname: uname });
        }
        else if (!(/^[a-zA-Z]+$/.test(lname))) {
            res.render('signup', { errMsg: "Last name can contain only alphabets", fname: fname, lname: "", add: add, cty: cty, zp: zp, emailid: emailid, uname: uname });
        }
        else if (!(/^([0-9]+ )?[a-zA-Z ]+$/.test(add))) {
            res.render('signup', { errMsg: "Invalid Street Address. Example: 5700 Centre Ave", fname: fname, lname: lname, add: "", cty: cty, zp: zp, emailid: emailid, uname: uname });
        }
        else if (!(/^[a-zA-Z]+$/.test(cty))) {
            res.render('signup', { errMsg: "City can contain only alphabets", fname: fname, lname: lname, add: add, cty: "", zp: zp, emailid: emailid, uname: uname });
        }
        else if (!(/^\d{5}(-\d{4})?$/.test(zp))) {
            res.render('signup', { errMsg: "Invalid zipcode Format", fname: fname, lname: lname, add: add, cty: cty, zp:"", emailid: emailid, uname: uname });
        }
        else if (!(/\S+@\S+\.\S+/.test(emailid))) {
            res.render('signup', { errMsg: "Invalid Email Address format", fname: fname, lname: lname, add: add, cty: cty, zp: zp, emailid: "", uname: uname });
        }
        else if (!(/^[a-z0-9_-]{3,15}$/.test(uname))) {
            res.render('signup', {
                errMsg: "Username must have atleast three characters which can be only alphabets, numbers and underscore", 
                fname: fname, lname: lname, add: add, cty: cty, zp: zp, emailid: emailid, uname: "" });
        }
        else if (!(/^([a-zA-Z0-9@*#]{5,15})$/.test(pwd))) {
            res.render('signup', {
                errMsg: "Password must have atleast 5 characters [can hold alphabets,numbers and @*#]",
                fname: fname, lname: lname, add: add, cty: cty, zp: zp, emailid: emailid, uname: uname});
        }
        else {
            verified = 1;
        }
        return verified;
    } 
    
    var renderLogin = function (err, conn) {
        var sql = 'insert into users values ("' + fname + '", "' + lname + '","' + add + '","' + cty + '","' + st + '",' + zp +
             ',"' + emailid + '","' + uname + '","' + pwd + '",0)';
        console.log(sql);
        conn.query(sql, function (err, results, fields) 
        {
            if (!err) {
                console.log(fname + "New user registered successfully");
                res.render('login', { errMsg: "Your account has been registered. Please login." });
            }
            else {
                console.log('Error while performing registration Query.');
                res.render('login', { errMsg: err });
            }
        });
        conn.release();
    }
       
    var checkUsernameAlreadyExists = function (err, conn) {
        conn.query("select * from users where uname=?", uname, function (err, rows, fields) {
            if (!err) {
                if (rows.length > 0) {
                    console.log(fname + "New user cannot be registered. Username already exists. ");
                    res.render('signup', { errMsg: "Username already exists. Please provide another one.", fname: fname, lname: lname, add: add, cty: cty, zp: zp, emailid: emailid, uname: "" });
                }
                else {
                    console.log(uname + "Username exists ");
                    mysql.getConnection(renderLogin);
                }
            }
            else {
                console.log('Error while performing duplicate Username Presence Query.');
                res.render('signup', { errMsg: err, fname: fname, lname: lname, add: add, cty: cty, zp: zp, emailid: emailid, uname: "" });
            }
        })
        conn.release();
    }

    var flag = checkInput();
    if (flag == 1) 
    {
        mysql.getConnection(checkUsernameAlreadyExists)
    } 

};
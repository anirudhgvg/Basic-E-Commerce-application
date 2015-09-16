
exports.loaduserUpdateProfile = function (req, res) {

    var renderUpdateProfile = function (err, rows, fields) {
        if (!err) {
            var sample1 = [];
            console.log('The solution for view users is: ', rows);
            var row = rows[0];     
            res.render('userUP', {
                errMsg: "", uname: row.uname, fname: row.fname, lname: row.lname, add: row.address, cty: row.city, st:row.state,
                zp: row.zip, emailid: row.email, pwd: row.pwd
            });
        }
        else {
            console.log('Error while performing update profile Query.' + err);
            res.render('userUP', {
                errMsg: "There was a problem with this action"+err, uname:"", fname:"", lname: "", add: "", cty: "", st:"",
                zp: "", emailid: "", pwd: ""
            });
        }
    }
    
    if (req.session.user) {
        var mysql = require('./mysql.js').pool;
        var ses = req.session;
        user = ses.user;
    
        console.log("Update Profile request received for user" + user);
        mysql.getConnection(function (err, conn) {
            conn.query("select * from users where uname=?", user, renderUpdateProfile)
            conn.release();
        })
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
    
};

exports.loaduserPostUpdateProfile = function (req, res) {
    
    if (req.session.user) {
        var mysql = require('./mysql.js').pool;
        
        var ses = req.session;
        user = ses.user;
        console.log("Update Profile request received for user" + user);
        var uname = user;
        var fname = req.body.fname;
        var lname = req.body.lname;
        var add = req.body.add;
        var cty = req.body.cty;
        var st = req.body.st;
        var zp = req.body.zp;
        var emailid = req.body.emailid;
        var pwd = req.body.pwd;
        
        var checkInput = function () {
            var verified = 0;
            if (!(/^[a-zA-Z]+$/.test(fname))) {
                res.render('userUP', { errMsg: "First name can contain only alphabets", fname: "", lname: lname, add: add, cty: cty, st: st, zp: zp, emailid: emailid, uname: uname, pwd: pwd });
            }
            else if (!(/^[a-zA-Z]+$/.test(lname))) {
                res.render('userUP', { errMsg: "Last name can contain only alphabets", fname: fname, lname: "", add: add, cty: cty, st: st, zp: zp, emailid: emailid, uname: uname, pwd: pwd });
            }
            else if (!(/^([0-9]+ )?[a-zA-Z ]+$/.test(add))) {
                res.render('userUP', { errMsg: "Invalid Street Address. Example: 5700 Centre Ave", fname: fname, lname: lname, add: "", cty: cty, st: st, zp: zp, emailid: emailid, uname: uname, pwd: pwd });
            }
            else if (!(/^[a-zA-Z]+$/.test(cty))) {
                res.render('userUP', { errMsg: "City can contain only alphabets", fname: fname, lname: lname, add: add, cty: "", st: st, zp: zp, emailid: emailid, uname: uname, pwd: pwd });
            }
            else if (!(/^\d{5}(-\d{4})?$/.test(zp))) {
                res.render('userUP', { errMsg: "Invalid zipcode Format", fname: fname, lname: lname, add: add, cty: cty, st: st, zp: "", emailid: emailid, uname: uname, pwd: pwd });
            }
            else if (!(/\S+@\S+\.\S+/.test(emailid))) {
                res.render('userUP', { errMsg: "Invalid Email Address format", fname: fname, lname: lname, add: add, cty: cty, st: st, zp: zp, emailid: "", uname: uname, pwd: pwd });
            }
            else if (!(/^[a-z0-9_-]{3,15}$/.test(uname))) {
                res.render('userUP', {
                    errMsg: "Username must have atleast three characters which can be only alphabets, numbers and underscore", 
                    fname: fname, lname: lname, add: add, cty: cty, st: st, zp: zp, emailid: emailid, uname: "", pwd: pwd
                });
            }
            else if (!(/^([a-zA-Z0-9@*#]{5,15})$/.test(pwd))) {
                res.render('userUP', {
                    errMsg: "Password must have atleast 5 characters [can hold alphabets,numbers and @*#]",
                    fname: fname, lname: lname, add: add, cty: cty, st: st, zp: zp, emailid: emailid, uname: uname, pwd: ""
                });
            }
            else {
                verified = 1;
            }
            return verified;
        }
        
        var updateProfile = function (err, conn) {
            var sql = 'update users set fname="' + fname + '",lname="' + lname + '",address="' + add +
             '",city="' + cty + '",state="' + st + '",zip="' + zp + '",email="' + emailid + '",pwd="' + pwd + '"where uname="' + user + '"';
            console.log("Update Query " + sql);
            conn.query(sql, function (err, rows, fields) {
                if (!err) {
                    console.log(uname + "User information updated ");
                    res.render('userUP', {
                        errMsg: "Your information has been updated.", uname: user, fname: fname, lname: lname, add: add, cty: cty, st: st,
                        zp: zp, emailid: emailid, pwd: pwd
                    });
                }
                else {
                    console.log('Error while performing Query.');
                    res.render('userUP', {
                        errMsg: "There was a problem with thisaction"+err, uname: user, fname: fname, lname: lname, add: add, cty: cty, st: st,
                        zp: zp, emailid: emailid, pwd: pwd
                    });
                }
            });
            conn.release();
        }
        
        var flag = checkInput();
        if (flag == 1) {
            mysql.getConnection(updateProfile)
        }
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
};

exports.loaduserViewProducts = function (req, res) {
    var mysql = require('./mysql.js').pool;
    
    var renderViewProducts = function (err, rows, fields) {
        if (!err) {
            var sample1 = [];
            if (rows.length > 0) {
                console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var user1 = { id: row.id, title: row.title, grp: row.grp };
                    sample1.push(user1);
                }
                console.log('View products Successful');
                res.render('userVP', { sample: sample1, errMsg: "" });
            }
            else {
                console.log('View products unsuccessful');
                res.render('userVP', { sample: sample1, errMsg: 'No products found matching the search string' });
            }
        }
        else {
            console.log('Error while performing view products Query.' + err);
            res.render('userVP', { sample: "", errMsg: err });
        }
    }
    
    var viewProd = function (err, conn) {
        var id1 = req.query.id;
        var cat1 = req.query.cat;
        var title1 = req.query.title;
        
        if (typeof id1 === 'undefined' || id1.length == 0) {
            console.log("id is undefined");
            id1 = "%";
        }
        if (typeof cat1 === 'undefined' || cat1.length == 0) {
            console.log("cat is undefined");
            cat1 = "";
        }
        if (typeof title1 === 'undefined' || title1.length == 0) {
            console.log("title is undefined");
            title1 = "";
        }
        
        sql = "select id,title,grp from product where id LIKE '" + id1 + "' and cat LIKE '%" + cat1 + "%' and title LIKE '%" + title1 + "%'";
        conn.query(sql, renderViewProducts)
        conn.release();
    }
    
    if (req.session.user) {
        var ses = req.session;
        console.log("View products request received for user" + ses.user);
        mysql.getConnection(viewProd)
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
    
};
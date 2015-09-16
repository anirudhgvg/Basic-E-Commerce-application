
exports.viewUsers = function (req, res) {
    console.log("View Users requested");
    var fname = req.query.fname;
    var lname = req.query.lname;
    var mysql = require('./mysql.js').pool;
        
    var renderViewUsers = function (err, rows, fields) {
        if (!err) {
            var sample1 = [];
            if (rows.length > 0) {
                console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var user1 = { fname: row.fname, lname: row.lname };
                    sample1.push(user1);
                }
                console.log('Admin View Users Successful');
                res.render('adminVU', { sample: sample1, errMsg: "" });
            }
            else {
                console.log('View users unsuccessful');
                res.render('adminVU', { sample: sample1, errMsg: 'No users found matching the search string' });
            }
        }
        else {
            console.log('Error while performing login Query.' + err);
        }
    }
    
    var searchUsers = function (err, conn) {
        var sql;
        console.log(fname, lname);
        if (lname == undefined && fname == undefined) {
            sql = "select fname,lname from users where adminflag = 0";
            console.log(sql);
        }
        else if (lname == undefined) {
            sql = "select fname,lname from users where fname LIKE '%" + fname + "%' and adminflag = 0";
            console.log(sql);
        }
        else if (fname == undefined) {
            sql = "select fname,lname from users where lname LIKE '%" + lname + "%' and adminflag = 0";
            console.log(sql);
        }
        else {
            sql = "select fname,lname from users where fname LIKE '%" + fname + "%' and adminflag = 0 and lname LIKE '%" + lname + "%'";
            console.log(sql);
        }
        
        conn.query(sql, renderViewUsers)
        conn.release();
    }

    if (req.session.user) {
        mysql.getConnection(searchUsers)
    }  
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }    
};

exports.loadadminViewProducts = function (req, res) {
    var mysql = require('./mysql.js').pool;
   
    var renderViewProducts = function (err, rows, fields) {
        if (!err) {
            var sample1 = [];
            if (rows.length > 0) {
                console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var user1 = { id: row.id, title: row.title,grp:row.grp };
                    sample1.push(user1);
                }
                console.log('Admin View Users Successful');
                res.render('adminVP', { sample: sample1, errMsg: "" });
            }
            else {
                console.log('View products unsuccessful');
                res.render('adminVP', { sample: sample1, errMsg: 'No products found matching the search string' });
            }
        }
        else {
            console.log('Error while performing view products Query.' + err);
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
        
        console.log("id is" + id1 + "cat is" + cat1 + "title is" + title1);
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

exports.loadadminModifyProducts = function (req, res) {
    var mysql = require('./mysql.js').pool;
    var id1 = req.query.id;

    var renderProductDetails = function (err, rows, fields) {
        if (!err) {
            if (rows.length > 0) {
                var user1;
                console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[0];
                    user1 = { id:row.id,title: row.title, grp: row.grp };
                }
                console.log('Modify Products Successful');
                res.render('adminMP', { errMsg: "", itid: user1.id, title: user1.title, desc: user1.grp });
            }
            else {
                console.log('Modify products unsuccessful');
                res.render('adminMP', { errMsg: 'No products found matching the product id',itid:"",title:"",desc:"" });
            }
        }
        else {
            console.log('Error while performing modify products Query.' + err);
            res.render('adminMP', { errMsg: 'No products found matching the product id'+err, itid: "", title: "", desc: "" });
        }
    }
    
    var getProdId = function (err, conn) {
        sql = "select id,title,grp from product where id ="+id1;
        conn.query(sql, renderProductDetails)
        conn.release();
    }

    if (req.session.user) {
        var ses = req.session;
        console.log("Modify products request received for user" + ses.user);
        if (id1 != undefined) {
            mysql.getConnection(getProdId)
        }
        else {
            res.render('adminMP', { errMsg: "", itid: "", title: "", desc: "" });
        }
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
    
};

exports.loadadminPostModifyProducts = function (req, res) {
    var mysql = require('./mysql.js').pool;
    var ses = req.session;
    console.log("Modify products request received for user" + ses.user);
    var id1 = req.body.id;
    var tit1 = req.body.title;
    var desc1 = req.body.desc;
    
    var renderModifyProducts = function (err, rows, fields) {
        if (!err) {
                console.log('Admin Modify Products Successful');
                res.render('adminMP', { errMsg: "The product information has been updated.",itid:id1,title:tit1,desc:desc1 });
            }
        else {
            console.log('Error while performing modify products Query.' + err);
            res.render('adminMP', { errMsg: "There was a problem with this action"+err, itid: id1, title: tit1, desc: desc1 });
        }
    }
    
    var modProd = function (err, conn) {
        sql = 'update product set title="'+tit1+'",grp="'+desc1+'"where id ="' + id1+'"';
        conn.query(sql, renderModifyProducts)
        conn.release();
    }
    
    if (req.session.user) {
        mysql.getConnection(modProd)
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
    
};
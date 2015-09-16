
/*
 * GET home page.
 */

exports.loaduserHomepage = function (req, res) {
    req.session.destroy();
    res.render('userHomepage');
};

exports.loadviewProducts = function (req, res) {
    var mysql = require('./mysql.js').pool;
    
    var ses = req.session;
    console.log("View products request received for user" + ses.user);
    
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
                res.render('viewProducts', { sample: sample1, errMsg: "" });
            }
            else {
                console.log('View products unsuccessful');
                res.render('viewProducts', { sample: sample1, errMsg: 'No products found matching the search string' });
            }
        }
        else {
            console.log('Error while performing view products Query.' + err);
            res.render('viewProducts', { sample: "", errMsg: err });
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
    
    mysql.getConnection(viewProd)
};

exports.loadLoggedUser = function (req, res) {
    if (req.session.user) {
        res.render('loggedUser');
    }
    else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
};

exports.loadLoginpage = function (req, res) {
    res.render('login', { errMsg: "" });
};

exports.loadSignuppage = function (req, res) {
    res.render('signup', { errMsg: "",fname:"",lname:"",add:"",cty:"",zp:"",emailid:"",uname:"" });
};

exports.loadadminHomepage = function (req, res) {
    if (req.session.user) {
        res.render('adminHomepage');
    } else {
        res.render('login', { errMsg: "Your session timed out. Please login." });
    }
};

exports.loadadminModifyProducts = function (req, res) {
    res.render('adminMP');
};

exports.loadadminViewProducts = function (req, res) {
    res.render('adminVP');
};


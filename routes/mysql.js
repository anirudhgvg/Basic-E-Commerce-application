var mysql = require('mysql');

var pool = mysql.createPool({
    host     : 'anirudhgvg.chca9pd2o96e.us-east-1.rds.amazonaws.com',
    user     : 'root',
    password : 'rootroot',
    database : 'quiz'
});

exports.pool = pool;

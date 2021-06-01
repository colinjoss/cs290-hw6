var mysql = require('mysql');
var pool = mysql.createPool({
connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_jossc',
    password        : '4414',
    database        : 'cs290_jossc'
});

module.exports.pool = pool;

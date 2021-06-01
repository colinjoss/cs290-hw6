var mysql = require('mysql');
var pool = mysql.createPool({
connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_jossc',
    password        : 'takingUpSpac3',
    database        : 'cs290_jossc'
});

module.exports.pool = pool;

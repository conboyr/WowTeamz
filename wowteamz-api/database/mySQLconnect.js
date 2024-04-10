var mysql      = require('mysql');

//var client_id = '482ea42427f84732a25ea8469ccb4e4a';
//var client_secret = 'wlWyNjtC8vxAsxHA7MiRrtNvuPfHVj9X';

var connection = mysql.createConnection({
    debug: true,

    host: 'wowteams.c1yk0064mthe.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'cs470isfun',
    database: 'WOW_TEAMS'
});

module.exports = connection;

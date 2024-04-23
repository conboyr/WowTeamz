const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');

require('dotenv').config();

const checkUserExist = (ctx) => {
    const { email } = ctx.params;
    console.log(email);

    return new Promise((resolve, reject) => {
        const query = "SELECT EXISTS(SELECT 1 FROM WT_Account WHERE email = ?) AS userExists";
        dbConnection.query({
            sql: query,
            values: [email]
        }, (error, results) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            }
            
            // Checking the first result's 'userExists' property which is expected to be 1 or 0
            const userExists = results[0].userExists;
            console.log(`User exists result: ${userExists}`);
            
            if (userExists) {
                console.log('User already exists');
                reject('Email is in use');
            } else {
                console.log('User does not exist in WT_Account, About to return ');
                ctx.body = {
                    status: "OK",
                };
                resolve();
            }
        });
    }).catch(err => {
        console.log('Error in checkUserExist function. Reason: ', err);
        ctx.status = 400; // Use a more appropriate status code for errors
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};



const addUser = (ctx) => {
    const {email, password, userName} = ctx.request.body;

    console.log(email, password, userName);

    return new Promise((resolve, reject) => {
        let query = "INSERT INTO WT_Account (email, password, userName, role) VALUES (?, ?, ?, 'admin')"
        ;
        dbConnection.query({
            sql: query,
            values: [email, password, userName]
        }, (error, tuples) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            } else {
                console.log('User has been successfully added');
                ctx.body = {
                    status: "OK",
                };
                resolve();
            }
            
        });
    }).catch(err => {
        console.log('authorize in LoginController threw an exception. Reason...', err);
        ctx.status = 400;  // Use a more appropriate status code for errors
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};


module.exports = {
    addUser,
    checkUserExist
};


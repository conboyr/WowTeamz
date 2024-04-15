const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');

require('dotenv').config();

const checkUserExist = (ctx) => {
    const { email } = ctx.request.body;

    console.log(email);

    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM WT_Account WHERE email = ?";
        dbConnection.query({
            sql: query,
            values: [email]
        }, (error, tuples) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            }
            console.log(ctx);
            console.log('here is the ctx');

            if (tuples.length === 1) {
                const user = tuples[0];
                console.log('A User with this email already exists');
                reject('A User with this email already exists');
            } else {
                // If user with the given email does not exist, resolve the promise
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
}


const addUser = (ctx) => {
    const { userName, email, password } = ctx.request.body;

    console.log(userName, email, password);

    return new Promise((resolve, reject) => {
        let query = "INSERT INTO WT_Account (email,  userName, `password`) VALUES (?, ?, ?)";
        dbConnection.query({
            sql: query,
            values: [email, userName, password]
        }, (error, tuples) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            }
            console.log(ctx);
            console.log('here is the ctx');
            
            if (tuples.length === 1) {
                const user = tuples[0];
                console.log('HERE I AM')
                console.log(user.password);
                console.log(user.userName);
                console.log(user.email);
                console.log(password);
                console.log('HERE I AM')
                // Compare the provided password with the hashed password from the database
                
            } else {
                console.log('Not able to identify the user.');
                reject('No such user.');
            }
            //setAccessToken(ctx, tuples[0]);
            resolve();
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


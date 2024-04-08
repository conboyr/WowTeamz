const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');


require('dotenv').config();

const authorizeUser = async (ctx) => {
    return new Promise((resolve, reject) => {
        const {email} = ctx.params; // Assuming email and password are passed in params

        let query = "SELECT * FROM WT_Account WHERE email = ?";
        dbConnection.query({
            sql: query,
            values: [email]
        }, (error, tuples) => {
            if (error) {
                console.log("Query error.", error);
                ctx.status = 500; // Internal Server Error
                ctx.body = {
                    status: "Failed",
                    error: "Query error.",
                    user: null
                };
                return reject("Query error.");
            }
            if (tuples.length === 1) {  // Match found
                setAccessToken(ctx, tuples[0]);
                console.log('Authorization successful. User:', tuples[0]);
                ctx.status = 200;
                ctx.body = {
                    status: "OK",
                    user: tuples[0],
                };
                resolve();
            } else {
                console.log('Credentials do not match.');
                ctx.status = 401; // Unauthorized
                ctx.body = {
                    status: "Failed",
                    error: "Credentials do not match.",
                    user: null
                };
                reject('Credentials do not match.');
            }
        });
    }).catch(err => {
        console.log('authorizeUser threw an exception. Reason:', err);
        // Note: Handling for catch block might be redundant here if the promises inside are already setting ctx.status and ctx.body.
        // You might want to handle the rejection logic inside the previous blocks.
    });
};


module.exports = {
    authorizeUser,
};

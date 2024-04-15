const dbConnection = require('../../database/mySQLconnect');
const setAccessToken = require('../../config/setAccessToken');

require('dotenv').config();

const authorizeUser = (ctx) => {
    const { email, password } = ctx.request.body;

    console.log(email, password);

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
                console.log('HERE I AM')
                console.log(user.password);
                console.log(password);
                console.log('HERE I AM')
                // Compare the provided password with the hashed password from the database
                if (password === user.password) {
                    setAccessToken(ctx, user);
                    console.log('from studentRecord. About to return ', user);
                    ctx.body = {
                        status: "OK",
                        user: user,
                }
                } else {
                    console.log('Password does not match.');
                    reject('Password does not match.');
                }
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
    authorizeUser
};


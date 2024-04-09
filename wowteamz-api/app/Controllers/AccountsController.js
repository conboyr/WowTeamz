const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const allAccounts = async (ctx) => {
    console.log('accounts all accounts called.');
    return new Promise((resolve, reject) => {
        const query = `
                       SELECT * FROM WT_Account
                        `;
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in AccountsController::allAccounts", error);
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allAccounts.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const accountWithEmail = (ctx) => {
        return new Promise((resolve, reject) => {
            const {email} = ctx.params; // Assuming email and password are passed in params

        let query = "SELECT * FROM WT_Account WHERE email = ?";
        dbConnection.query({
            sql: query,
            values: [email]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in AccountsController::accountWithAccountID", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                ctx.body = tuples;
                ctx.status = 200;
                return resolve();
            });
        }).catch(err => {
            console.log("Database connection error in allAccounts.", err);
            // The UI side will have to look for the value of status and
            // if it is not 200, act appropriately.
            ctx.body = [];
            ctx.status = 500;
        });
}

module.exports = {
    allAccounts,
    accountWithEmail
};

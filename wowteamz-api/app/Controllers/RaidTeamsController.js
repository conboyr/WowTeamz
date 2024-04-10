const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const allRaidTeams = async (ctx) => {
    console.log('accounts all accounts called.');
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM WT_raidTeam";
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in AccountsController::allRaidTeams", error);
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allRaidTeams.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const raidTeamWithID = (ctx) => {
        return new Promise((resolve, reject) => {
            const {raidTeam_id} = ctx.params; // Assuming email and password are passed in params

        let query = "SELECT * FROM WT_raidTeam WHERE raidTeam_id = ?";
        dbConnection.query({
            sql: query,
            values: [raidTeam_id]
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

const addPlayerToRaid = (ctx) => {
    return new Promise((resolve, reject) => {

    let query = "UPDATE WT_Character SET raidTeam_id = ? WHERE character_id = ?;"
    
    ;
    dbConnection.query({
        sql: query,
        values: [ctx.params.raidTeam_id, ctx.params.character_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in RaidTeamsController::addPlayerToRaid", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addPlayerToRaid.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

module.exports = {
    allRaidTeams,
    addPlayerToRaid
};

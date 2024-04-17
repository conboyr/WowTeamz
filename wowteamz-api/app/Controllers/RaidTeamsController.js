const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const allRaidTeams = async (ctx) => {
    console.log('all raid teams called.');
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

const checkForRaid = (ctx) => {
    const { teamName } = ctx.params;
    console.log(teamName);

    return new Promise((resolve, reject) => {
        const query = "SELECT EXISTS(SELECT 1 FROM WT_raidTeam WHERE teamName = ?) AS raidExists";
        dbConnection.query({
            sql: query,
            values: [teamName]
        }, (error, results) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            }
            
            // Checking the first result's 'raidExists' property which is expected to be 1 or 0
            const raidExists = results[0].raidExists;
            console.log(`Raid exists result: ${raidExists}`);
            
            if (raidExists) {
                console.log('Raid already exists');
                reject('Name is in use');
            } else {
                console.log('Raid does not exist in WT_raidTeam, About to return ');
                ctx.body = {
                    status: "OK",
                };
                resolve();
            }
        });
    }).catch(err => {
        console.log('Error in checkRaidExist function. Reason: ', err);
        ctx.status = 400; // Use a more appropriate status code for errors
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};


const charsForRaidTeam = (ctx) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT * 
            FROM WT_Character c 
            JOIN WT_raidTeam r ON c.raidTeam_id = r.raidTeam_id 
            WHERE c.raidTeam_id = ?
                    `;
        dbConnection.query({
            sql: query,
            values: [ctx.params.raidTeam_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in RaidTeamsController::charsForRaidTeam", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in charsForRaidTeam.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}


const createRaidTeam = (ctx) => {
        return new Promise((resolve, reject) => {
            const {teamName, raidDay_A, raidDay_B, raidTime, numPlayers} = ctx.request.body; // Assuming email and password are passed in params

        let query = `INSERT INTO WT_raidTeam (teamName, raidDay_A, raidDay_B, raidTime, numPlayers)
                     VALUES (?, ?, ?, ?, ?)`
        ;
        dbConnection.query({
            sql: query,
            values: [teamName, raidDay_A, raidDay_B, raidTime, numPlayers]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in RaidTeamsController::createRaidTeam", error);
                    ctx.body = [];
                    ctx.status = 200;
                    return reject(error);
                }
                
                ctx.body = {
                    status: "OK",
                };
                resolve();
            });
        }).catch(err => {
            console.log("Database connection error in createRaidTeam.", err);
            // The UI side will have to look for the value of status and
            // if it is not 200, act appropriately.
            ctx.body = [];
            ctx.status = 500;
        });
}

const addCharToRaid = (ctx) => {
    return new Promise((resolve, reject) => {

    let query = "UPDATE WT_Character SET raidTeam_id = ? WHERE character_id = ?"
    
    ;
    dbConnection.query({
        sql: query,
        values: [ctx.params.raidTeam_id, ctx.params.character_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in RaidTeamsController::addCharToRaid", error);
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

const deleteRaid = async (ctx) => {
    const teamName = ctx.params;  // Assuming you're passing the character's ID in the route parameter
    try {
        const query = `
            DELETE FROM WT_raidTeam
            WHERE teamName = ?;
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [teamName]
            }, (error, results) => {
                if (error) {
                    console.error("Database deletion error:", error);
                    ctx.status = 500;
                    ctx.body = { message: "Failed to delete character" };
                    return reject(error);
                }
                ctx.body = {
                    status: "OK",
                };
                resolve();
            });
        });
    } catch (error) {
        console.error('Error deleting character data:', error);
        ctx.status = 500;
        ctx.body = { message: "Failed to delete data", error: error.message };
    }
};

module.exports = {
    allRaidTeams,
    createRaidTeam,
    addCharToRaid,
    checkForRaid,
    deleteRaid,
    charsForRaidTeam
};

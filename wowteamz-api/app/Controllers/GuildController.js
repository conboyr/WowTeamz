const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');

function now() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
}

const getGuild = async (ctx) => {
    console.log('get guild called.');
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM WT_Guild";
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in GuildController::getGuild", error);
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

const checkForGuild = (ctx) => {
    const { guild_name } = ctx.params;
    console.log(guild_name);

    return new Promise((resolve, reject) => {
        const query = "SELECT EXISTS(SELECT 1 FROM WT_Guild WHERE guild_name = ?) AS guildExists";
        dbConnection.query({
            sql: query,
            values: [guild_name]
        }, (error, results) => {
            if (error) {
                console.log("Query error.", error);
                reject(`Query error. Error msg: ${error}`);
                return;
            }
            
            // Checking the first result's 'guildExists' property which is expected to be 1 or 0
            const guildExists = results[0].guildExists;
            console.log(`Guild exists result: ${guildExists}`);
            
            if (guildExists) {
                console.log('Guild already exists');
                reject('Name is in use');
            } else {
                console.log('Guild does not exist in WT_Guild, About to return ');
                ctx.body = {
                    status: "OK",
                };
                resolve();
            }
        });
    }).catch(err => {
        console.log('Error in checkGuildExist function. Reason: ', err);
        ctx.status = 400; // Use a more appropriate status code for errors
        ctx.body = {
            status: "Failed",
            error: err,
            user: null
        };
    });
};



const raidsForGuild = (ctx) => {
    return new Promise((resolve, reject) => {
        const {guild_id} = ctx.params;
        const query = `
        SELECT r.guild_id, r.guild_name, r.teamName, r.raidDay_A, r.raidDay_B, r.raidTime, r.numPlayers
        FROM WT_raidTeam r 
        JOIN WT_Guild g ON r.guild_id = g.guild_id 
        WHERE r.guild_id = ?
        `;
        dbConnection.query({
            sql: query,
            values: [guild_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in GuildController::raidsForGuild", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in raidsForGuild.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}


const createGuild = (ctx) => {
        return new Promise((resolve, reject) => {
            const {guild_name, faction, gm_name, realm} = ctx.request.body; // Assuming email and password are passed in params

        let query = `INSERT INTO WT_Guild (guild_name, faction, gm_name, realm)
                     VALUES (?, ?, ?, ?)`
        ;
        dbConnection.query({
            sql: query,
            values: [guild_name, faction, gm_name, realm]
            }, (error, tuples) => {
                if (error) {
                    console.log("Connection error in GuildController::createGuild", error);
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
            console.log("Database connection error in createGuild.", err);
            // The UI side will have to look for the value of status and
            // if it is not 200, act appropriately.
            ctx.body = [];
            ctx.status = 500;
        });
}

const addAccntToGuild = (ctx) => {
    return new Promise((resolve, reject) => {

    let query = "UPDATE WT_Account SET guild_id = ? WHERE account_id = ?";
    dbConnection.query({
        sql: query,
        values: [ctx.params.guild_id, ctx.params.account_id]
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in GuildController::addAccntToGuild", error);
                ctx.body = [];
                ctx.status = 200;
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in addAccntToGuild", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}

const removeAccnt = async (ctx) => {
    const {account_id} = ctx.params;  // Assuming you're passing the character's ID in the route parameter
    try {
        const query = `
        UPDATE WT_Account SET guild_id = null WHERE account_id = ?
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [account_id]
            }, (error, results) => {
                if (error) {
                    console.error("Database deletion error:", error);
                    ctx.status = 500;
                    ctx.body = { message: "Failed to remove account from guild" };
                    return reject(error);
                }
                ctx.body = {
                    status: "OK",
                };
                resolve();
            });
        });
    } catch (error) {
        console.error('Error deleting account data:', error);
        ctx.status = 500;
        ctx.body = { message: "Failed to delete data", error: error.message };
    }
};


const deleteGuild = async (ctx) => {
    const {guild_id} = ctx.params;  // Assuming you're passing the character's ID in the route parameter
    try {
        const query = `
            DELETE FROM WT_Guild
            WHERE guild_id = ?
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [guild_id]
            }, (error, results) => {
                if (error) {
                    console.error("Database deletion error:", error);
                    ctx.status = 500;
                    ctx.body = { message: "Failed to delete Guild" };
                    return reject(error);
                }
                ctx.body = {
                    status: "OK",
                };
                resolve();
            });
        });
    } catch (error) {
        console.error('Error deleting guild data:', error);
        ctx.status = 500;
        ctx.body = { message: "Failed to delete data", error: error.message };
    }
};

module.exports = {
    getGuild,
    createGuild,
    addAccntToGuild,
    checkForGuild,
    deleteGuild,
    removeAccnt,
    raidsForGuild
};

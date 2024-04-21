const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

//const fetch = require('node-fetch');

async function callBlizzardAPI(userName) {
    const API_KEY = 'US4hhyJwuQ11JwH5lhUFx2viOGVuqPqSKS';
    const url = `https://raider.io/api/v1/characters/profile?region=us&realm=illidan&name=${userName}&fields=gear`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Blizzard API call failed with status: ${response.status}`);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //console.log(`Data received: ${JSON.stringify(data)}`);

        if (!data.thumbnail_url) {
            console.error('Thumbnail URL is missing from the API response');
            throw new Error('Thumbnail URL is missing');
        }

        return {
            name: data.name,
            characterClass: data.class,
            race: data.race,
            gearLevel: data.gear.item_level_equipped,
            imgPath: data.thumbnail_url
        };
    } catch (error) {
        console.error(`Error in callBlizzardAPI: ${error}`);
        throw error;
    }
}
const insertCharacter = async (ctx) => {
    const userName = ctx.request.body.userName;
    console.log(userName.imgPath);
    try {
        const { name, characterClass, race, gearLevel, imgPath } = await callBlizzardAPI(userName);

        const query = `
            INSERT INTO WT_Character (name, class, race, gearScore, imagePath)
            VALUES (?, ?, ?, ?, ?)
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [name, characterClass, race, gearLevel, imgPath]
            }, (error, results) => {
                if (error) {
                    console.error("Database insertion error:", error);
                    ctx.status = 500;
                    ctx.body = "Failed to insert character";
                    return reject(error);
                }
                // Return the newly added character data to the frontend
                ctx.status = 201;
                ctx.body = { name, characterClass, race, gearLevel, imgPath }; // Ensure this matches what the frontend expects
                resolve();
            });
        });
    } catch (error) {
        console.error('Error fetching character data:', error);
        ctx.status = 500;
        ctx.body = "Failed to fetch or insert data";
    }
};
const allCharacters = async (ctx) => {
    console.log('accounts all allCharacters called.');
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM WT_Character`;
        dbConnection.query({
            sql: query,
        }, (error, tuples) => {
            if (error) {
                console.log("Connection error in allCharacters::allCharacters", error);
                return reject(error);
            }
            ctx.body = tuples;
            ctx.status = 200;
            return resolve();
        });
    }).catch(err => {
        console.log("Database connection error in allCharacters.", err);
        // The UI side will have to look for the value of status and
        // if it is not 200, act appropriately.
        ctx.body = [];
        ctx.status = 500;
    });
}
const deleteCharacter = async (ctx) => {
    const name = ctx.params.name;  // Assuming you're passing the character's ID in the route parameter
    try {
        const query = `
            DELETE FROM WT_Character
            WHERE name = ?;
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [name]
            }, (error, results) => {
                if (error) {
                    console.error("Database deletion error:", error);
                    ctx.status = 500;
                    ctx.body = { message: "Failed to delete character" };
                    return reject(error);
                }
                ctx.status = 200;
                ctx.body = { message: "Character deleted successfully" };
                resolve();
            });
        });
    } catch (error) {
        console.error('Error deleting character data:', error);
        ctx.status = 500;
        ctx.body = { message: "Failed to delete data", error: error.message };
    }
};
const insertNotes = async (ctx) => {
    const name = ctx.params.name;
    const { notes } = ctx.request.body;
    try {


        const query = `
            UPDATE WT_Character 
            SET notes = ?
            WHERE name = ?
        `;
        await new Promise((resolve, reject) => {
            dbConnection.query({
                sql: query,
                values: [notes, name]
            }, (error, results) => {
                if (error) {
                    console.error("Database update error:", error);
                    ctx.status = 500;
                    ctx.body = "Failed to update notes";
                    return reject(error);
                }
                if (results.affectedRows > 0) {
                    ctx.status = 200;
                    ctx.body = { success: true, message: "Notes updated successfully" };
                    resolve();
                } else {
                    ctx.status = 404;
                    ctx.body = { success: false, message: "Character not found" };
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error('Error updating notes:', error);
        ctx.status = 500;
        ctx.body = "Failed to update notes";
    }
};
module.exports = {
    insertCharacter,
    allCharacters,
    deleteCharacter,
    insertNotes
};
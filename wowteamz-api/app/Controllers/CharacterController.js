const dbConnection = require('../../database/mySQLconnect');
const dateFormat = require('dateformat');
const buildStudentViewFromCourses = require('../Schema/buildStudentViewFromCourses');

//const fetch = require('node-fetch');

async function callBlizzardAPI(userName) {
    const API_KEY = 'US4hhyJwuQ11JwH5lhUFx2viOGVuqPqSKS'; // Use environment variables for production
    try {
        const response = await fetch(`https://raider.io/api/v1/characters/profile?region=us&realm=illidan&name=${userName}&fields=gear`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const name = data.name;
        const characterClass = data.class;
        const race = data.race;
        const gearLevel = data.gear.item_level_equipped;
        const imgData = data.thumbnail_url;

        return { name, characterClass, race, gearLevel, imgData };
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
const insertCharacter = async (ctx) => {
    const userName = ctx.request.body.userName;
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
module.exports = {
    insertCharacter,
    allCharacters
};
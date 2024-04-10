import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function NameInputComponent() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [names, setNames] = useState([]);

    const handleAddName = async () => {
        if (name) {
            try {
                // Rename the destructured variables to avoid conflict with the state variable 'name'
                const { name: apiName, characterClass, race, gearLevel, imgData } = await callBlizzardAPI(name);
                // Now, use 'apiName' where you previously used 'name' for the API response
                const characterInfo = {
                    name: apiName, // Use the renamed variable here
                    class: characterClass,
                    race: race,
                    gearLevel: gearLevel,
                    img : imgData,
                };
                setNames([...names, characterInfo]); // Use the response from the API
                setName('');
                setIsEditing(false);
            } catch (error) {
                console.error('API call failed:', error);
                // Handle the error (e.g., show an error message)
            }
        }
    };


    async function callBlizzardAPI(userName) {
        const API_KEY = 'US4hhyJwuQ11JwH5lhUFx2viOGVuqPqSKS'; // Update with your actual API key
        try {
            const response = await fetch(`https://raider.io/api/v1/characters/profile?region=us&realm=illidan&name=${userName}&fields=gear`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();

            // Extracting the required details from the response
            const name = data.name;
            const characterClass = data.class;
            const race = data.race;
            const gearLevel = data.gear.item_level_equipped; // Make sure this matches the actual path in the JSON
            const imgData = data.thumbnail_url;
            // Returning the extracted details in an object
            return { name, characterClass, race, gearLevel, imgData }; // Adjust as needed for additional fields
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            throw error; // Allows the caller to handle the error
        }
    }

    return (
        <Box>
            {names.map((characterInfo, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                    <img src={characterInfo.img} alt={`${characterInfo.name}'s avatar`} style={{ width: '100px', height: '100px' }} />
                    <Typography variant="h6" component="div">
                        Name: {characterInfo.name}, Class: {characterInfo.class}, Race: {characterInfo.race}, Gear Level: {characterInfo.gearLevel}
                    </Typography>
                </Box>
            ))}

            {isEditing && (
                <TextField
                    label="Enter Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleAddName} // Optionally trigger on blur
                    onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                    fullWidth // Trigger on Enter key
                />
            )}

            <IconButton
                onClick={() => setIsEditing(true)}
                aria-label="add"
                size="large"
                sx={{ fontSize: '3rem', mt: 2 }}
            >
                <AddIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
        </Box>
    );
}

export default NameInputComponent;
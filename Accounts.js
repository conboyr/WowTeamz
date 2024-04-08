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

    const handleAddName = () => {
        if (name) {
            callBlizzardAPI(name).then((apiResponseName) => {
                setNames([...names, apiResponseName]); // Use response from the API
                setName('');
                setIsEditing(false);
            }).catch((error) => {
                console.error('API call failed:', error);

            });
        }
    };


    async function callBlizzardAPI(userName) {
        const API_KEY = 'US4hhyJwuQ11JwH5lhUFx2viOGVuqPqSKS'; // Make sure to replace this with your actual API key
        fetch(`https://raider.io/api/v1/characters/profile?region=us&realm=illidan&name=${userName}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => console.log(data))
            .catch(error => console.error('There was a problem with your fetch operation:', error));
    }

    return (
        <Box>
            {names.map((savedName, index) => (
                <Typography key={index} variant="h6" component="div" sx={{ mt: 2 }}>
                    {savedName}
                </Typography>
            ))}

            {isEditing && (
                <TextField
                    label="Enter Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleAddName} // Optionally trigger on blur
                    onKeyPress={(e) => e.key === 'Enter' && handleAddName()} // Trigger on Enter key
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
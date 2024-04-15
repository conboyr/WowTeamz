import React, { useState, useEffect } from 'react';
import API from '../../API_Interface/API_Interface'; // Ensure this path is correct
import { Box, TextField, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const characterTableAttributes = [
    {
        title: 'Image',
        attributeDBName: 'imagePath',
        align: 'left'
    },
    {
        title: 'Name',
        attributeDBName: 'name',
        align: 'left'
    },
    {
        title: 'Race',
        attributeDBName: 'race',
        align: 'left'
    },
    {
        title: 'Class',
        attributeDBName: 'class',
        align: 'left'
    },
    {
        title: 'Item Level',
        attributeDBName: 'gearScore',
        align: 'left'
    },
];

function NameInputComponent() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [characters, setCharacters] = useState([]);
    const api = new API();

    useEffect(() => {
        const fetchCharacters = async () => {
            const response = await api.allCharacters();
            if (response.data) {
                setCharacters(response.data);
            }
        };

        fetchCharacters();  // Initial fetch
        const intervalId = setInterval(fetchCharacters, 5000);  // Fetch every 5000 ms (5 seconds)

        return () => clearInterval(intervalId);  // Clear interval on component unmount
    }, []);

    const handleAddName = async () => {
        if (name) {
            try {
                const characterData = await api.insertCharacter(name);
                if (characterData.error) {
                    throw characterData.error;
                }
                setCharacters([...characters, characterData]);
                setName('');
                setIsEditing(false);
            } catch (error) {
                console.error('API call failed:', error);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Characters
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="characters table">
                    <TableHead>
                        <TableRow>
                            {characterTableAttributes.map((attr) => (
                                <TableCell key={attr.title} align={attr.align}>
                                    {attr.title}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characters.map((character, index) => (
                            <TableRow key={index}>
                                {characterTableAttributes.map((attr) => {
                                    const content = attr.attributeDBName === 'imagePath' ? (
                                        <img src={character[attr.attributeDBName]} alt={`Avatar of ${character.name}`} style={{ width: '100px', height: '100px' }} />
                                    ) : (
                                        character[attr.attributeDBName]
                                    );

                                    // Log to console for debugging
                                    if (attr.attributeDBName === 'imgPath') {
                                        console.log(`Image path for ${character.name}:`, character[attr.attributeDBName]);
                                    }

                                    return (
                                        <TableCell key={attr.title} align={attr.align}>
                                            {content}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {isEditing && (
                <TextField
                    label="Enter Character Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleAddName}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                    fullWidth
                    sx={{ mt: 2 }}
                />
            )}

            <IconButton
                onClick={() => setIsEditing(true)}
                aria-label="add character"
                size="large"
                sx={{ fontSize: '3rem', mt: 2 }}
            >
                <AddIcon sx={{ fontSize: 'inherit' }} />
            </IconButton>
        </Box>
    );
}

export default NameInputComponent;
import React, { useState, useEffect } from 'react';
import API from '../../API_Interface/API_Interface'; // Ensure this path is correct
import { Box, TextField, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
const raidBuffRequirements = {
    Paladin: 2,
    Druid: 1,
    DemonHunter: 1,
    Monk: 1,
    Priest: 1,
    Mage: 1,
    Evoker: 1,
    Hunter: 1,
    Warrior: 1,
    Rogue: 1,
    Warlock: 1,
};
function NameInputComponent() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [characters, setCharacters] = useState([]);
    const [editIdx, setEditIdx] = useState(null);
    const [editedText, setEditedText] = useState('');
    const api = new API();
    const [expandedId, setExpandedId] = useState(null);
    const [characterCount, setCharacterCount] = useState(0);
    const [missingBuffs, setMissingBuffs] = useState([]);



    function standardizeClassName(className) {
        if (!className) {
            console.warn("Encountered undefined className, defaulting to empty string.");
            return '';  // Return a default or handle it as you see fit
        }
        return className.replace(/\s+/g, '');

    }
    function calculateMissingBuffs(characters) {
        const classCounts = {};


        Object.keys(raidBuffRequirements).forEach(requiredClass => {
            classCounts[requiredClass] = 0;
        });


        characters.forEach(character => {
            const className = standardizeClassName(character.class); // Ensure this is the correct property for class
            if (classCounts.hasOwnProperty(className)) {
                classCounts[className]++;
            }
        });


        const missingBuffs = [];
        Object.entries(raidBuffRequirements).forEach(([className, requiredCount]) => {
            const countShort = requiredCount - classCounts[className];
            if (countShort > 0) {
                missingBuffs.push(`Missing ${countShort} ${className}${countShort > 1 ? 's' : ''}`);
            }
        });

        return missingBuffs;
    }
//useEffect for all characters
    useEffect(() => {
        const fetchCharacters = async () => {
            const response = await api.allCharacters();

            if (response.data) {
                setCharacters(response.data);
                setCharacterCount(response.data.length);
            }
        };

        fetchCharacters();  // Initial fetch
        const intervalId = setInterval(fetchCharacters, 5000);  // Fetch every 5000 ms (5 seconds)

        return () => clearInterval(intervalId);  // Clear interval on component unmount
    }, []);

    useEffect(() => {
        if (characters.length > 0 && characters.every(char => char.class !== undefined)) {
            const buffs = calculateMissingBuffs(characters);
            setMissingBuffs(buffs);
        } else {
            console.log("Waiting for characters data to be fully loaded or verified...");
        }
    }, [characters]);
    const handleAddName = async () => {
        if (name) {
            try {
                const characterData = await api.insertCharacter(name);
                console.log(characterData);
                if (characterData.error) {
                    throw characterData.error;
                }
                setCharacters([...characters, characterData]);
                setCharacterCount(prev => prev + 1);
                setName('');
                setIsEditing(false);
            } catch (error) {
                console.error('API call failed:', error);
            }
        }
    };
    const handleDelete = async (characterName) => {
        try {
            const encodedName = characterName;
            const response = await api.deleteCharacter(encodedName);
            if (response.status === 200) {
                setCharacters(characters.filter(char => char.name !== characterName));
                setCharacterCount(prev => prev - 1);
            } else {
                throw new Error('Failed to delete character');
            }
        } catch (error) {
            console.error('Error deleting character:', error);
            // Optionally, show an error message to the user
        }
    };
    const handleEdit = (index) => {
        setEditIdx(index);
        setEditedText(characters[index].detail || '');  // Assuming 'detail' is what you want to edit
    };
    const saveEdit = async (index) => {
        const character = characters[index];
        const characterName = character.name;  // Assuming character name is stored under 'name'
        const notes = editedText;  // The text currently in the editable TextField

        try {
            // Calling the API to update the notes in the backend
            const response = await api.insertNotes(characterName, notes);
            if (response.status === 200) {
                // Update the local state to reflect the changes
                const updatedCharacter = { ...character, detail: notes };
                setCharacters(characters.map((char, i) => i === index ? updatedCharacter : char));
                setEditIdx(null);
                setEditedText('');
            } else {
                // Handle possible errors here, you might want to inform the user
                throw new Error('Failed to update notes');
            }
        } catch (error) {
            console.error('Error updating notes:', error);
            // Optionally, display an error message to the user
        }
    };

    const cancelEdit = () => {
        setEditIdx(null);
        setEditedText('');
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>Characters</Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Character Count: {characterCount}/20
            </Typography>
            {missingBuffs.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    {missingBuffs.map((buff, index) => (
                        <Typography key={index} color="error">
                            {buff}
                        </Typography>
                    ))}
                </Box>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="characters table">
                    <TableHead>
                        <TableRow>
                            {characterTableAttributes.map((attr) => (
                                <TableCell key={attr.title} align={attr.align}>{attr.title}</TableCell>
                            ))}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characters.map((character, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    {characterTableAttributes.map((attr) => (
                                        <TableCell key={attr.title} align={attr.align}>
                                            {attr.attributeDBName === 'imagePath' ? (
                                                <img src={character[attr.attributeDBName]} alt={`Avatar of ${character.name}`} style={{ width: '70px', height: '70px' }} />
                                            ) : (
                                                character[attr.attributeDBName]
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">
                                        <IconButton onClick={() => setExpandedId(expandedId === index ? null : index)}>
                                            {expandedId === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                        <IconButton onClick={() => handleEdit(index)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Button variant="outlined" color="error" onClick={() => handleDelete(character.name)}>
                                            Delete
                                        </Button>
                                        {editIdx === index && (
                                            <Box>
                                                <TextField
                                                    value={editedText}
                                                    onChange={(e) => setEditedText(e.target.value)}
                                                    size="small"
                                                />
                                                <Button onClick={() => saveEdit(index)}>Save</Button>
                                                <Button onClick={cancelEdit}>Cancel</Button>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                                {expandedId === index && (
                                    <TableRow>
                                        <TableCell colSpan={characterTableAttributes.length + 1}>
                                            <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                                                {character.notes || 'No notes available'}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
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
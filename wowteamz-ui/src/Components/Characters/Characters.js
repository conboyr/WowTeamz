import React, { useState, useEffect } from 'react';
import API from '../../API_Interface/API_Interface'; // Ensure this path is correct
import { Box, TextField, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RoleSelectionComponent from './RoleSelectionComponent'
const characterTableAttributes = [
    {
        title: 'Image',
        attributeDBName: 'imagePath',
        align: 'left'
    },
    {
        title: 'Role',
        attributeDBName: 'role',
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
const classColorMap = {
    DeathKnight: '#dca3a3', // Soft Dark Red
    Paladin: '#f4a7b1', // Soft Pink
    Druid: '#f5c78e', // Soft Orange
    Warrior: '#c0c0c0', // Light Gray
    Mage: '#add8e6', // Light Blue
    Hunter:'#9acd32' , // Light Green'#9acd32'
    Rogue: '#f0e68c', // Khaki
    Priest: '#f5f5f5', // Off White
    Shaman: '#b0e0e6', // Powder Blue
    Warlock: '#d8bfd8', // Thistle
    Monk: '#98fb98', // Yellow Green
    DemonHunter: '#d8bfd8', // Light Purple
    Evoker: '#afeeee', // Pale Turquoise
};
function NameInputComponent({ raidID }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [characters, setCharacters] = useState([]);
    const [editIdx, setEditIdx] = useState(null);
    const [editedText, setEditedText] = useState('');
    const api = new API();
    const [expandedId, setExpandedId] = useState(null);
    const [characterCount, setCharacterCount] = useState(0);
    const [missingBuffs, setMissingBuffs] = useState([]);
    const [isMinimalView, setIsMinimalView] = useState(false);

    console.log(raidID);

    function standardizeClassName(className) {
        if (!className) {
            console.warn("Encountered undefined className, defaulting to empty string.");
            return '';  // Return a default or handle it as you see fit
        }
        return className.replace(/\s+/g, '');

    }
    const sortedCharacters = characters.sort((a, b) => {
        const roleOrder = {
            Tank: 1,
            Healer: 2,
            DPS: 3,
            undefined: 4,
        };
        return (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4);
    });
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
            const response = await api.allCharacters(raidID);
            console.log(response);
            if (response.data) {
                setCharacters(response.data);
                console.log(response.data);
                setCharacterCount(response.data.length);
            }
        };

        fetchCharacters();  // Initial fetch
        const intervalId = setInterval(fetchCharacters, 5000);  // Fetch every 5000 ms (5 seconds)

        return () => clearInterval(intervalId);  // Clear interval on component unmount
    }, [raidID]);

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
                const characterData = await api.insertCharacter(name, raidID);
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
                const updatedCharacter = {...character, detail: notes};
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
    const handleUpdateRole = async (characterName, newRole, raidTeam_id) => {
        try {
            await api.insertRole(characterName, raidTeam_id, newRole);  // Pass role, characterName, raidTeam_id
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };
    return (
        <Box position="relative">
            <Typography variant="h4" sx={{mb: 2}}>
                Characters
            </Typography>
            <Typography variant="subtitle1" sx={{mb: 2}}>
                Character Count: {characterCount}/20
            </Typography>

            {missingBuffs.length > 0 && (
                <Box sx={{mb: 2}}>
                    {missingBuffs.map((buff, index) => (
                        <Typography key={index} color="error">
                            {buff}
                        </Typography>
                    ))}
                </Box>
            )}

            <Button
                variant="outlined"
                onClick={() => setIsMinimalView((prev) => !prev)}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    borderColor: 'black',
                    color: 'black',
                }}
            >
                {isMinimalView ? 'Expanded View' : 'Minimal View'}
            </Button>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="characters table">
                    <TableHead>
                        <TableRow>
                            {characterTableAttributes
                                .filter(
                                    (attr) => !isMinimalView || ['Role', 'Name', 'Class'].includes(attr.title)
                                ) // Only display "Role," "Name," "Class" in Minimal View
                                .map((attr) => (
                                    <TableCell key={attr.title} align={attr.align}>
                                        {attr.title}
                                    </TableCell>
                                ))}
                            {!isMinimalView && (
                                <TableCell align="center">Actions</TableCell>  // Display "Actions" in Expanded View
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedCharacters.map((character, index) => (
                            <React.Fragment key={index}>
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor:
                                            classColorMap[standardizeClassName(character.class)] || '#FFFFFF',
                                    }}
                                >
                                    {characterTableAttributes
                                        .filter(
                                            (attr) => !isMinimalView || ['Role', 'Name', 'Class'].includes(attr.title)
                                        )
                                        .map((attr) => (
                                            <TableCell key={attr.title} align={attr.align}>
                                                {attr.attributeDBName === 'imagePath' && !isMinimalView ? (
                                                    <img
                                                        src={character[attr.attributeDBName]}
                                                        alt={`Avatar of ${character.name}`}
                                                        style={{width: '70px', height: '70px'}}
                                                    />
                                                ) : attr.attributeDBName === 'role' ? (
                                                    <RoleSelectionComponent
                                                        character={character}
                                                        handleUpdateRole={handleUpdateRole}  // Role selection
                                                    />
                                                ) : (
                                                    character[attr.attributeDBName]  // Display other values
                                                )}
                                            </TableCell>
                                        ))}
                                    {!isMinimalView && (
                                        <TableCell align="center">
                                            <IconButton
                                                onClick={() => setExpandedId(expandedId === index ? null : index)}>
                                                {expandedId === index ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                            </IconButton>
                                            <IconButton onClick={() => handleEdit(index)}>
                                                <MoreVertIcon/>
                                            </IconButton>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(character.name)}
                                            >
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
                                                    <Button onClick={cancelEdit}>Cancel
                                                    </Button>
                                                </Box>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                                {expandedId === index && (
                                    <TableRow>
                                        <TableCell colSpan={characterTableAttributes.length + 1}>
                                            <Typography variant="body2" style={{whiteSpace: 'pre-wrap'}}>
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
                    onKeyPress={(e) => e.key === 'Enter' && handleAddName()}
                    fullWidth
                    sx={{
                        borderColor: 'black',
                        color: 'black',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: 'black',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'black',
                            },
                        },
                    }}
                />
            )}
            <IconButton
                onClick={() => setIsEditing(true)}
                aria-label="add character"
                size="large"
                sx={{fontSize: '3rem', mt: 2}}
            >
                <AddIcon sx={{fontSize: 'inherit'}}/>
            </IconButton>
        </Box>
    );
}
export default NameInputComponent;

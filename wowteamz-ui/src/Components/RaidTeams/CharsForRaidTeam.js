import React, {useState, useEffect, Fragment} from 'react';
import API from '../../API_Interface/API_Interface'

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';

const raidteamsTableAttributes = [
    {
        title: 'Raid ID',
        attributeDBName: 'raidTeam_id',
        align: 'left'
    },
    {
        title: 'Team Name',
        attributeDBName: 'teamName',
        align: 'left'
    },
    {
        title: 'Raid Size',
        attributeDBName: 'numPlayers',
        align: 'left'
    },
    {
        title: 'Raid Day 1',
        attributeDBName: 'raidDay_A',
        align: 'left'
    },
    {
        title: 'Raid Day 2',
        attributeDBName: 'raidDay_B',
        align: 'left'
    },
    {
        title: 'Raid Time (PST)',
        attributeDBName: 'raidTime',
        align: 'left'
    },
    {
        title: 'Players on Bench',
        attributeDBName: 'numBench',
        align: 'left'
    },
    {
        title: 'Trials',
        attributeDBName: 'numTrial',
        align: 'left'
    },
]; 

const characterTableAttributes = [
    {
        title: 'Team Name',
        attributeDBName: 'teamName',
        align: 'left'
    },
    {
        title: 'Name',
        attributeDBName: 'name',
        align: 'left'
    },
    {
        title: 'Role',
        attributeDBName: 'role',
        align:'left'
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


export default function CharacterTable({setMakeRaidMode, setAddCharMode, setOneRaidMode, setRaid, setChars }) {
    const [characters, setCharacters] = useState([]);
    const [raidteams, setRaidTeams] = useState([]);
    const [openRows, setOpenRows] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const [raidTeam_id, setRaidTeam_id] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [removeMode, setRemoveMode] = useState(false);
    const [character_id, setCharacter_id] = useState(null);
    const [raidTeamName, setRaidTeamName] = useState("");
    const [highlightMode, setHighlightMode] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [hoveredCIdx, setCHoveredIdx] = useState(null);
    const [reloadTable, setReloadTable] = useState(false);
    //ALL TEAMS

    useEffect(() => {
        const api = new API();

        async function getRaidTeams() {
            const raidteamsJSONString = await api.allRaidTeams();
            console.log(`raidteams from the DB ${JSON.stringify(raidteamsJSONString)}`);
            setRaidTeams(raidteamsJSONString.data);
        }
        setReloadTable(false);
        getRaidTeams();
    }, [reloadTable]);

    //DROP DOWN ARROW
    
    useEffect(() => {
        if (raidTeam_id) { // Only run the effect if raidTeam_id is not null
            const api = new API();
    
            async function charsForRaidTeam() {
                const charactersJSONString = await api.charsForRaidTeam(JSON.stringify(raidTeam_id));
                console.log(JSON.stringify(raidTeam_id));
                console.log(`characters from the DB ${JSON.stringify(charactersJSONString)}`);
                setCharacters(charactersJSONString.data);
                setOpenRows(new Array(charactersJSONString.data.length).fill(false));
            }
    
            charsForRaidTeam();
        }
    }, [raidTeam_id]); // Add raidTeam_id to the dependency array
     // Execute useEffect whenever buttonClicked changes

    //REMOVE CHARACTER

    useEffect(() => {
        if (removeMode) {
            const api = new API();
            async function removeChar() {
                try {
                    console.log('here you are');
                    console.log(character_id);
                    const userInfo = await api.removeChar(JSON.stringify(character_id));
                    console.log(`API returns user info and it is: ${JSON.stringify(userInfo.data.user)}`);
                } catch (error) {
                    console.error('Failed to remove character from team:', error);
                }
            }
            
            removeChar().then(() => {
                setRemoveMode(false); // Reset deleteMode to prevent repeated deletion
                setReloadTable(true);
            });
        }
    }, [removeMode, character_id]);

    //DELETE TEAM

    useEffect(() => {
        if (deleteMode) {
            const api = new API();
            async function deleteRaid() {
                try {
                    console.log('here you are');
                    console.log(raidTeam_id);
                    const userInfo = await api.deleteRaid(JSON.stringify(raidTeam_id));
                    console.log(`API returns user info and it is: ${JSON.stringify(userInfo.data.user)}`);
                } catch (error) {
                    console.error('Failed to delete raid team:', error);
                }
            }
            
            deleteRaid().then(() => {
                setDeleteMode(false); // Reset deleteMode to prevent repeated deletion
                setReloadTable(true);
            });
        }
    }, [deleteMode, raidTeam_id]);


    //HANDLERS

    const handleRaidClick = (raid) => {
        console.log(raid);
        console.log(characters);
        setRaid(raid);
        setChars(characters);
        setOneRaidMode(true);
    };

    const handleMouseEnter = (index) => {
        setHoveredIdx(index);  // Set the currently hovered row index
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);  // Clear the hovered row index
    };

    const handleCMouseEnter = (index) => {
        setCHoveredIdx(index);  // Set the currently hovered row index
    };

    const handleCMouseLeave = () => {
        setCHoveredIdx(null);  // Clear the hovered row index
    };

    

    const handleRowToggle = (index) => {
        setRaidTeam_id(index.raidTeam_id);
        const newOpenRows = [...openRows];
        newOpenRows[index] = !newOpenRows[index];
        setOpenRows(newOpenRows);
    };

    const handleButtonClick = (raidTeam_id) => {
        setButtonClicked(true); // Set buttonClicked to true when button is clicked
        setRaidTeam_id(raidTeam_id);
    };

    const handleRemove = async (char, event) => {
        event.stopPropagation(); // This stops the event from bubbling up to the parent elements.
        console.log(char.raidTeam_id);
        setCharacter_id(char.character_id);
        setRemoveMode(true);
        console.log("Remove clicked for", char);
    };

    const handleDelete = (raidteam, event) => {
        event.stopPropagation(); // This stops the event from bubbling up to the parent elements.
        console.log(raidteam.raidTeam_id);
        setRaidTeam_id(raidteam.raidTeam_id); // Assuming you rename setRaidTeam to setRaidTeamId for clarity
        setDeleteMode(true);
        console.log("Delete clicked for", raidteam);
    };
    
    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="outlined" color="success" onClick={() => setMakeRaidMode(true)}>
                            Add Raid Team
                            <IconButton
                                aria-label="add character"
                                size="large"
                                color="green"
                                sx={{ fontSize: '2rem', ml: 1 }}
                            >
                                <AddIcon sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                        </Button>
                    </Box>
                </Grid>
            </Grid> 
    
            {raidteams.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="market table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                {raidteamsTableAttributes.map((attr, idx) => (
                                    <TableCell key={idx} align={attr.align}>
                                        {attr.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {raidteams.map((team, idx) => (
                                <Fragment key={idx}>
                                    <TableRow sx={{ backgroundColor: idx === hoveredIdx ? '#CFD8D7' : 'inherit' }}
                                        onMouseEnter={() => handleMouseEnter(idx)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <TableCell>
                                            <IconButton key={idx}
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => {
                                                    
                                                    handleRowToggle(idx);
                                                    handleButtonClick(raidteams[idx]['raidTeam_id']);
                                                }}
                                            >
                                                {openRows[idx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        {raidteamsTableAttributes.map((attr, idx) => (
                                            <TableCell key={idx} align={attr.align} onClick={() => handleRaidClick(team)}>
                                                {team[attr.attributeDBName]}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <Button variant="outlined" color="error" onClick={(event) => handleDelete(team, event)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {openRows[idx] && (
                                        <TableRow>
                                            <TableCell colSpan={raidteamsTableAttributes.length + 1}>
                                                <TableContainer component={Paper}>
                                                    <Table size="small" sx={{ backgroundColor: '#E6EEF0' }}> 
                                                        <TableHead>
                                                            <TableRow>
                                                                {characterTableAttributes.map((attr, idx) => (
                                                                    <TableCell key={idx} align={attr.align}>
                                                                        {attr.title}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {Array.isArray(characters) && characters.map((character, idx) => (

                                                                <TableRow key={idx} sx={{ backgroundColor: idx === hoveredCIdx ? '#CFD8D7' : 'inherit' }}
                                                                onMouseEnter={() => handleCMouseEnter(idx)}
                                                                onMouseLeave={handleCMouseLeave}>
                                                                    {characterTableAttributes.map((attr, idx) => (
                                                                        <TableCell key={idx} align={attr.align}>
                                                                           {character[attr.attributeDBName]}
                                                                        </TableCell>
                                                                    ))}
                                                                    <TableCell align="center">
                                                                        <Button variant="outlined" color="error" onClick={(event) => handleRemove(character, event)}>
                                                                            Remove
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Fragment>
    );
    
    
};


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
        title: '',
        attributeDBName: '',
        align: 'left'
    },
    {
        title: 'Image',
        attributeDBName: 'imagePath',
        align: 'left'
    },
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


export default function CharacterTable({setMakeRaidMode, setAddCharMode, setOneRaidMode, setRaid}) {
    const [characters, setCharacters] = useState([]);
    const [raidteam, setRaidTeam] = useState([]);
    const [openRows, setOpenRows] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const [raidTeam_id, setRaidTeam_id] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [removeChar, setRemoveChar] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [raidTeamName, setRaidTeamName] = useState("");
    const [highlightMode, setHighlightMode] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [reloadTable, setReloadTable] = useState(false);
    //ALL TEAMS

    useEffect(() => {
        const api = new API();

        async function getRaidTeams() {
            const raidteamsJSONString = await api.allRaidTeams();
            console.log(`raidteams from the DB ${JSON.stringify(raidteamsJSONString)}`);
            setRaidTeam(raidteamsJSONString.data);
        }
        setReloadTable(false);
        getRaidTeams();
    }, [reloadTable]);

    //DROP DOWN ARROW
    
    useEffect(() => {
        if (buttonClicked) {
            const api = new API();

            async function getCharacters() {
                const charactersJSONString = await api.charsForRaidTeam(JSON.stringify(raidTeam_id));
                setCharacters(charactersJSONString.data);
                setOpenRows(new Array(charactersJSONString.data.length).fill(false));
            }
    
            getCharacters();
        }
    }, [buttonClicked, raidTeam_id]); // Execute useEffect whenever buttonClicked changes

    //REMOVE CHARACTER

    useEffect(() => {
        if (buttonClicked) {
            const api = new API();

            async function getCharacters() {
                const charactersJSONString = await api.charsForRaidTeam(JSON.stringify(raidTeam_id));
                setCharacters(charactersJSONString.data);
                setOpenRows(new Array(charactersJSONString.data.length).fill(false));
            }
    
            getCharacters();
        }
    }, [removeChar]); // Execute useEffect whenever buttonClicked changes

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
        setRaid(raid);
        setOneRaidMode(true);
    };

    const handleMouseEnter = (index) => {
        setHoveredIdx(index);  // Set the currently hovered row index
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);  // Clear the hovered row index
    };

    const handleRemove = async (name) => {
        setRemoveChar(true);
        setCharacterName(name)
    };

  

    const handleRowToggle = (index) => {
        const newOpenRows = [...openRows];
        newOpenRows[index] = !newOpenRows[index];
        setOpenRows(newOpenRows);
    };

    const handleButtonClick = (raidTeam_id) => {
        setButtonClicked(true); // Set buttonClicked to true when button is clicked
        setRaidTeam_id(raidTeam_id);
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
    
            {raidteam.length > 0 && (
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
                            {raidteam.map((team, idx) => (
                                <Fragment key={idx}>
                                    <TableRow sx={{ backgroundColor: idx === hoveredIdx ? '#CFD8D7' : 'inherit' }}
                                        onMouseEnter={() => handleMouseEnter(idx)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <TableCell>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleRowToggle(idx);
                                                    handleButtonClick(raidteam[idx]['raidTeam_id']);
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
                                                    <Table size="small"> 
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

                                                                <TableRow key={idx}>
                                                                    {characterTableAttributes.map((attr, idx) => (
                                                                        <TableCell key={idx} align={attr.align}>
                                                                            {character[attr.attributeDBName]}
                                                                        </TableCell>
                                                                    ))}
                                                                    <TableCell align="center">
                                                                        <Button variant="outlined" color="error" onClick={() => handleRemove(character.name)}>
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


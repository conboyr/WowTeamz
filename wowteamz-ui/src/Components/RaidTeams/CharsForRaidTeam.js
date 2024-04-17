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


export default function CharacterTable({setMakeRaidMode, setAddCharMode}) {
    const [characters, setCharacters] = useState([]);
    const [raidteam, setRaidTeam] = useState([]);
    const [openRows, setOpenRows] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const [raidTeam_id, setRaidTeam_id] = useState(null);
    const [deleteTeam, setDeleteTeam] = useState(false);
    const [removeChar, setRemoveChar] = useState(false);
    const [characterName, setCharacterName] = useState("");
    const [raidTeamName, setRaidTeamName] = useState("");

    //ALL TEAMS

    useEffect(() => {
        const api = new API();

        async function getRaidTeams() {
            const raidteamsJSONString = await api.allRaidTeams();
            console.log(`raidteams from the DB ${JSON.stringify(raidteamsJSONString)}`);
            setRaidTeam(raidteamsJSONString.data);
        }

        getRaidTeams();
    }, []);

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
        if (buttonClicked) {
            const api = new API();

            async function getCharacters() {
                const charactersJSONString = await api.charsForRaidTeam(JSON.stringify(raidTeam_id));
                setCharacters(charactersJSONString.data);
                setOpenRows(new Array(charactersJSONString.data.length).fill(false));
            }
    
            getCharacters();
        }
    }, [deleteTeam]); // Execute useEffect whenever buttonClicked changes

    //HANDLERS

    const handleRemove = async (name) => {
        setRemoveChar(true);
        setCharacterName(name)
    };

    const handleDelete = async (teamName) => {
        setDeleteTeam(true);
        setRaidTeamName(teamName)
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
                            sx={{ fontSize: '2rem', ml: 1 }} // Adjust ml for spacing between Typography and IconButton
                        >
                            <AddIcon sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="outlined" color="success" onClick={() => setAddCharMode(true)}>
                                                                        Add Character to Raid
                            <IconButton
                            aria-label="add character"
                            size="large"
                            color="green"
                            sx={{ fontSize: '2rem', ml: 1 }} // Adjust ml for spacing between Typography and IconButton
                        >
                            <AddIcon sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                        </Button>
                    </Box>
                </Grid>
            </Grid> 


            {raidteam.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="market table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell> {/* Empty TableCell for the icon button */}
                                {raidteamsTableAttributes.map((attr, idx) => (
                                    <TableCell key={idx} align={attr.align}>
                                        {attr.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {raidteam.map((raidteam, idx) => (
                                <Fragment key={idx}>
                                    <TableRow>
                                        <TableCell>
                                            <IconButton key={idx}
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => {
                                                    handleRowToggle(idx);
                                                    handleButtonClick(raidteam[idx]['raidTeam_id']);
                                                }}
                                            >{openRows[idx] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        {raidteamsTableAttributes.map((attr, idx) => (
                                            <TableCell key={idx} align={attr.align}>
                                                {raidteam[attr.attributeDBName]}
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <Button variant="outlined" color="error" onClick={() => handleDelete(raidteam.teamName)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {openRows[idx] && (
                                        <TableRow>
                                            <TableCell colSpan={raidteamsTableAttributes.length + 1}>
                                                <TableContainer component={Paper}>
                                                    <Table>
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
                                                            {characters.map((character, idx) => (
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


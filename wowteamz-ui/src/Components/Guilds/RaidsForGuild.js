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

const guildTableAttributes = [
    {
        title: 'Guild Name',
        attributeDBName: 'teamName',
        align: 'left'
    },
    {
        title: 'Server',
        attributeDBName: 'realm',
        align: 'left'
    },
    {
        title: 'Faction',
        attributeDBName: 'faction',
        align: 'left'
    },
    {
        title: 'Members',
        attributeDBName: 'num_members',
        align: 'left'
    },
    {
        title: 'Guild Master',
        attributeDBName: 'gm_name',
        align: 'left'
    },
];


export default function GuildTable({setMakeGuildMode}) {
    //const [characters, setCharacters] = useState([]);
    const [guilds, setGuild] = useState([]);
    const [openRows, setOpenRows] = useState([]);
    const [raids, setRaids] = useState([]);
    const [guildName, setGuildName] = useState('');
    const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
    const [guild_id, setGuild_id] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [reloadTable, setReloadTable] = useState(false);

    //GET GUILD

   

    //DROP DOWN ARROW
    /*
    useEffect(() => {
        if (guild_id) { // Only run the effect if raidTeam_id is not null
            const api = new API();
    
            async function raidsForGuild() {
                const charactersJSONString = await api.raidsForGuild(JSON.stringify(guild_id));
                console.log(JSON.stringify(guild_id));
                console.log(`characters from the DB ${JSON.stringify(charactersJSONString)}`);
                setCharacters(charactersJSONString.data);
                setOpenRows(new Array(charactersJSONString.data.length).fill(false));
            }
    
            raidsForGuild();
        }
    }, [guild_id]); // Add raidTeam_id to the dependency array
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
    
    //DELETE Guild

    useEffect(() => {
        if (deleteMode) {
            const api = new API();
            async function deleteGuild() {
                try {
                    console.log('here you are');
                    console.log(guild_id);
                    const userInfo = await api.deleteGuild(JSON.stringify(guild_id));
                    console.log(`API returns user info and it is: ${JSON.stringify(userInfo.data.user)}`);
                } catch (error) {
                    console.error('Failed to delete raid team:', error);
                }
            }
            
            deleteGuild().then(() => {
                setDeleteMode(false); // Reset deleteMode to prevent repeated deletion
                setReloadTable(true);
            });
        }
    }, [deleteMode, guild_id]);


    //HANDLERS

    const handleGuildClick = (guild) => {
        console.log(guild);
        console.log(raids);
        setGuild(guild);
        setRaids(raids);
    };

    const handleMouseEnter = (index) => {
        setHoveredIdx(index);  // Set the currently hovered row index
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);  // Clear the hovered row index
    };
    
    const handleButtonClick = (guild_id) => {
        setButtonClicked(true); // Set buttonClicked to true when button is clicked
        setGuild_id(guild_id);
    };

/*
    const handleRowToggle = (index) => {
        setRaidTeam_id(index.raidTeam_id);
        const newOpenRows = [...openRows];
        newOpenRows[index] = !newOpenRows[index];
        setOpenRows(newOpenRows);
    };

    const handleRemove = async (char, event) => {
        event.stopPropagation(); // This stops the event from bubbling up to the parent elements.
        console.log(char.raidTeam_id);
        setCharacter_id(char.character_id);
        setRemoveMode(true);
        console.log("Remove clicked for", char);
    };

    const handleDelete = (guild, event) => {
        event.stopPropagation(); // This stops the event from bubbling up to the parent elements.
        console.log(guild.guild_id);
        setGuild_id(guild.guild_id); // Assuming you rename setRaidTeam to setRaidTeamId for clarity
        setDeleteMode(true);
        console.log("Delete clicked for", guild);
    };
*/


    useEffect(() => {
        const api = new API();

        async function getGuilds() {
            const guildJSONString = await api.getGuild();
            console.log(`guild from the DB ${JSON.stringify(guildJSONString)}`);
            setGuild(guildJSONString.data);
        }
        
        getGuilds();
    }, []);

    const TRow = ({guildObject, onClick}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                guildTableAttributes.map((attr, idx) =>
                    <TableCell key={idx} onClick={() => onClick(guildObject)}
                               align={attr.align}>
                        {
                            guildObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }
    
    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button variant="outlined" color="success" onClick={() => setMakeGuildMode(true)}>
                            Create Guild
                            <IconButton
                                aria-label="Create Guild"
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
    
           
        {
            guilds.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="guild table">
                        <TableHead>
                            <TableRow>
                                {
                                    guildTableAttributes.map((attr, idx) =>
                                        <TableCell  key={idx}
                                                    align={attr.align}>
                                            {attr.title}
                                        </TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                guilds.map((guild, idx) => (
                                    <TRow guildObject={guild} key={idx}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
       
        </Fragment>
    );
    
    
}


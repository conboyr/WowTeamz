import React, {useState, useEffect, Fragment} from 'react';
import API from '../../API_Interface/API_Interface'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const raidteamsTableAttributes = [
    {
        title: 'Raid Team ID',
        attributeDBName: 'raidTeam_id',
        align: 'left'
    },
    {
        title: 'Team Name',
        attributeDBName: 'teamName',
        align: 'left'
    },
    {
        title: 'Number of Players',
        attributeDBName: 'numPlayers',
        align: 'left'
    },
    {
        title: 'Players on the Bench',
        attributeDBName: 'numBench',
        align: 'left'
    },
    {
        title: 'Trials',
        attributeDBName: 'numTrials',
        align: 'left'
    },
]; 

export default function RaidTeamsComponent() {

    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [user, setUser] = useState(undefined);

    const handleInputCharacter = event => {
        console.log("handleInputCharacter called.");

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Submit") {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
    };

    const handleInputRaid = event => {
        console.log("handleInputRaid called.");

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Submit") {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
    };

    useEffect(() => {
 
        if( ! verifyUser || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            api.getUserInfo(userInput)
                .then( userInfo => {
                console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                const user = userInfo.user;
                if( userInfo.status === "OK" ) {
                    setUser(user);
                } else  {
                    setVerifyUser(false);
                    setAuthFailed(true);
                }
            });
        }

        getUserInfo();
    }, [verifyUser, setUser, userInput]);

    const [raidteams, setRaidTeams] = useState([]);
    console.log(`in AccountTable accounts contains is ${JSON.stringify(raidteams)}`);


    useEffect(() => {
        const api = new API();

        async function getRaidTeams() {
            const raidteamsJSONString = await api.allRaidTeams();
            console.log(`raidteams from the DB ${JSON.stringify(raidteamsJSONString)}`);
            setRaidTeams(raidteamsJSONString.data);
        }

        getRaidTeams();
    }, []);
    
    const TRow = ({raidteamObject, onClick}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                raidteamsTableAttributes.map((attr, idx) =>
                    <TableCell key={idx} onClick={() => onClick(raidteamObject)}
                               align={attr.align}>
                        {
                            raidteamObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }

    return (

        <Fragment>
            <Typography component="h1" variant="h5">
            Add a character to your raid using their character ID
            </Typography> 
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={10}>
            <Typography component="h5" variant="h5">Enter Character Name</Typography> 
                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    label="Character Name"
                    placeholder=""
                    fullwidth
                    value={userInput}
                    onChange={handleInputCharacter}
                />
                <Divider />
                <Typography component="h5" variant="h5">Enter Raid Team Name</Typography>
                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    label="Raid Team Name"
                    placeholder=""
                    fullwidth
                    value={userInput}
                    onChange={handleInputRaid}
                />
                <Divider />
                <Box display="flex" justifyContent="center" alignItems="center" width="50%" mt={4}>
                <Button
                    variant="contained"
                    size="medium"
                    sx={{ mt: 4, mb: 2 }}
                    onClick={() => {setVerifyUser(true)}}
                >Proceed</Button>
                </Box>
            </Box>
        <Typography component="h1" variant="h5">
            Here is a list of all members of your raid team.
            </Typography> 
        {
            raidteams.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="account table">
                        <TableHead>
                            <TableRow>
                                {
                                    raidteamsTableAttributes.map((attr, idx) =>
                                        <TableCell  key={idx}
                                                    align={attr.align}>
                                            {attr.title}
                                        </TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                raidteams.map((raidteam, idx) => (
                                    <TRow raidteamObject={raidteam} key={idx}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
        </Fragment>
    );
}





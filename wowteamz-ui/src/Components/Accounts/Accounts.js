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


import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';

const accountsTableAttributes = [
    {
        title: 'Email',
        attributeDBName: 'email',
        align: 'left'
    },
    {
        title: 'User Name',
        attributeDBName: 'userName',
        align: 'left'
    },
    {
        title: 'Account ID',
        attributeDBName: 'account_id',
        align: 'left'
    },
    {
        title: 'Role',
        attributeDBName: 'role',
        align: 'left'
    },
]; 

export default function NameInputComponent() {

//START display of characters in database

    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [user, setUser] = useState(undefined);

    const handleInputChange = event => {
        console.log("handleInputChange called.");

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Sign In") {
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

    const [accounts, setAccounts] = useState([]);
    console.log(`in AccountTable accounts contains is ${JSON.stringify(accounts)}`);


    useEffect(() => {
        const api = new API();

        async function getAccounts() {
            const accountsJSONString = await api.allAccounts();
            console.log(`accounts from the DB ${JSON.stringify(accountsJSONString)}`);
            setAccounts(accountsJSONString.data);
        }

        getAccounts();
    }, []);
    
    const TRow = ({accountObject, onClick}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                accountsTableAttributes.map((attr, idx) =>
                    <TableCell key={idx} onClick={() => onClick(accountObject)}
                               align={attr.align}>
                        {
                            accountObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }

    return (

        <Fragment>
        <Typography component="h1" variant="h5">
            Here is a list of all your characters that reside in your account.
            </Typography> 
        {
            accounts.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="account table">
                        <TableHead>
                            <TableRow>
                                {
                                    accountsTableAttributes.map((attr, idx) =>
                                        <TableCell  key={idx}
                                                    align={attr.align}>
                                            {attr.title}
                                        </TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                accounts.map((account, idx) => (
                                    <TRow accountObject={account} key={idx}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
        </Fragment>
    );
}





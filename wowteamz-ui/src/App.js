import {Fragment} from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MainDrawer from './menu/MainDrawer';

const makeUserName = ({userName}) => {

    return `${userName}`;
};

export default function App({user, logoutAction}) {
    const mainPageTitle = "WoW-Teamz";

    return (
                <MainDrawer title={mainPageTitle}
                            user={makeUserName(user)}
                            logoutAction={logoutAction}/>
    )

}


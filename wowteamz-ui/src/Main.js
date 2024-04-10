import Login from './Login';
import App from './App';
import {useState, Fragment} from 'react';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const logout = (setUser) => {
    return () => {
        setUser(undefined);
    }
};
export default function Main() {
const [user, setUser] = useState(undefined);
  

  return (
        <Fragment>
            {
                user !== undefined ? (
                    <App user={user} logoutAction={logout(setUser)} />
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
            </Fragment> 
  );
}
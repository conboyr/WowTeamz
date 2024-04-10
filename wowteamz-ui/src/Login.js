


import React, {useState, useEffect, Fragment} from 'react';
import API from './API_Interface/API_Interface';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();



export default function Login({setUser}) {
    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);

    
      
    const handleInputChange = event => {
        console.log("handleInputChange called.");

//        event.stopPropagation();
//        event.preventDefault();

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


    return (
       <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
           <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={10}>
                
                <TextField
                    error={authFailed}
                    id="outlined-error-helper-text"
                    label="Email"
                    placeholder=""
                    fullwidth
                    value={userInput}
                    onChange={handleInputChange}
                />
                <Divider />
                </Box>

                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

                <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2}>
                <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => {setVerifyUser(true)}}
                >Proceed</Button>
                </Box>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
        
            </Box>
          </Box>

          </Grid>
      </Grid>
    </ThemeProvider>  
       

    );
}
import React, { useState, useEffect } from "react";
import API from "./API_Interface/API_Interface";
import {
  Avatar, Box, Button, Checkbox, CssBaseline, Divider, FormControlLabel,
  Grid, Link, Paper, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Login({ setUser, setSignupMode}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authFailed, setAuthFailed] = useState(false);
  const [verifyUser, setVerifyUser] = useState(false);
  //const [newUser, setNewUser] = useState(false);
 
  const handleLogin = () => {
    console.log("handleLogin called.");
    if (email.length === 0 || password.length === 0) {
      setAuthFailed(true);
    } else {
      setAuthFailed(false);
      setVerifyUser(true);  // Move user verification flag here
    }
  };

  const handleSignup = () => {
    console.log("handleSignup called.");
    setSignupMode(true); // Toggle signup mode to true
  };


  useEffect(() => {
    if (!verifyUser) return;

    const api = new API();
    async function getUserInfo() {
        api.getUserInfo(email, password)
        .then( userInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(userInfo)}`);
        const user = userInfo.data.user;
        console.log("BELOW IS USER");
        console.log(user);
        if (userInfo.data.status === "OK") {
          console.log("SETTING USER to USER");
          setUser(user);
        } else {
          setVerifyUser(false);
          setAuthFailed(true);
        }
      });
    }
    getUserInfo();
  }, [verifyUser, email, password, setUser]); // Ensure dependencies are correctly listed

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{
          backgroundImage: "url(https://i.imgur.com/4SbfxIK.jpeg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ 
            my: 8, mx: 4, display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <Box> 
            <img src="http://www.royconboy.com/images/WT-logo.PNG" alt="WT Logo" style={{ width: '100%', height: 'auto' }} />
            </Box>
            
            <Box component="form" noValidate sx={{ mt: 1}}>
              <TextField
                error={authFailed}
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                helperText={authFailed ? "Invalid email or password" : ""}
              />
              <TextField
                error={authFailed}
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(p) => setPassword(p.target.value)}
                margin="normal"
                helperText={authFailed ? "Invalid email or password" : ""}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                Sign In
              </Button>
              
                
                <Button
                  variant="contained"
                  sx={{ mt: 3, mb: 2, marginLeft: 1 }} // Added marginLeft to create space between the Typography and Button
                  onClick={handleSignup}
                >
                  Sign up here
                </Button>
              

            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

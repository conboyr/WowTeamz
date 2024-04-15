import React, { useState, useEffect } from "react";
import API from "./API_Interface/API_Interface";
import {
  Avatar, Box, Button, Checkbox, CssBaseline, Divider, FormControlLabel,
  Grid, Link, Paper, TextField, Typography, createTheme, ThemeProvider
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from '@mui/material/Container';


const defaultTheme = createTheme();

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [exist, setExist] = useState(true);
  const [userCheck, setUserCheck] = useState(false);

  const handleSubmit = () => {
    console.log('Submit Signup Called');
    setUserCheck(true);
  };

  useEffect(() => {

    const api = new API();
    async function insertNewUser() {
        api.insertNewUser(userName, email, password)
        .then( userInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(userInfo)}`);
        const user = userInfo.data.user;
        console.log("BELOW IS USER");
        console.log(user);
        if (userInfo.data.status === "NOT FOUND") {
          console.log("USER IS NOT FOUND, PROCEED WITH SIGNUP");
          setExist(false);
        } else {
          alert("Signup Sucessful, Thank you for signing up!");
        }
      });
    }

    insertNewUser();
  }, [exist]);

  useEffect(() => {

    const api = new API();
    async function checkUserEmail() {
        api.checkUserEmail(email)
        .then( userInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(userInfo)}`);
        const user = userInfo.data.user;
        console.log("BELOW IS USER");
        console.log(user);
        if (userInfo.data.status === "NOT FOUND") {
          console.log("USER IS NOT FOUND, PROCEED WITH SIGNUP");
          setExist(false);
          setUserCheck(false);
        } else {
          alert("Email already in use, please try another email address.");
        }
      });
    }

    checkUserEmail();
  }, [userCheck]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  value={userName}
                  onChange={(u) => setUserName(u.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(p) => setPassword(p.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
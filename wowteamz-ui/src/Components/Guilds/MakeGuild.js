import React, { useState, useEffect } from "react";
import API from "../../API_Interface/API_Interface";
import {
  Avatar, Box, Button, Checkbox, InputLabel, MenuItem, FormHelperText, FormControl, Select, CssBaseline, Divider, FormControlLabel,
  Grid, Link, Paper, TextField, Typography, createTheme, ThemeProvider
} from "@mui/material";
import Container from '@mui/material/Container';


const defaultTheme = createTheme();

export default function SignUp({setMakeGuildMode, account_id}) {
  const [guild_name, setGuildName] = useState("");
  const [faction, setFaction] = useState("");
  const [gm_name, setGuildMaster] = useState("");
  const [realm, setRealm] = useState("");
  const [exist, setExist] = useState(true);
  const [guildCheck, setGuildCheck] = useState(false);


  const handleSubmit = () => {
    console.log('Submit Guild Called');
    setGuildCheck(true);
  };

  const handleGoBack = () => {
    console.log('Guild Mode called');
    setMakeGuildMode(false);
  };


  // CHECK FOR GUILD

  useEffect(() => {
    if (guild_name.length === 0) return;
    const api = new API();

    async function checkForGuild() {
        api.checkForGuild(guild_name)
        .then( userInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(userInfo.data.user)}`);
        console.log("HERE IS USERINFO.DATA");
        console.log (userInfo.data);
        console.log("BELOW IS USER status");
        console.log(userInfo.data.status);
        if (userInfo.data.status === "OK") {  
          console.log("USER IS NOT FOUND, PROCEED WITH SIGNUP");
          setExist(false);
        }
      });
    }

    checkForGuild();
  }, [guildCheck]);

  // ADD TO DATABASE 

  useEffect(() => {
    if (guild_name.length === 0 || faction.length === 0 || gm_name.length === 0 || realm.length === 0) return;
    const api = new API();
    async function createGuild() {
        api.createGuild(guild_name, faction, gm_name, realm)
        .then( newUserInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(newUserInfo)}`);
        if (newUserInfo.data.status === "OK") {
          alert("Guild Created!");
          setMakeGuildMode(false);
        } else {
          alert("Creation NOT Sucessful");
        }
      });
    }

    createGuild();
  }, [exist]);



  

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
          <Typography component="h1" variant="h5">
            Create Guild
          </Typography>
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="guild_name"
                    label="Guild Name"
                    name="guild_name"
                    value={guild_name}
                    onChange={(n) => setGuildName(n.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="fac">Faction</InputLabel>
                      <Select
                      id="fac"
                      value={faction}
                      label="Faction"
                      onChange={(a) => setFaction(a.target.value)}
                      >
                      <MenuItem value="">
                          <em>None</em>
                      </MenuItem>
                      <MenuItem value={'Horde'}>Horde</MenuItem>
                      <MenuItem value={'Alliance'}>Alliance</MenuItem>
                      </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="realm"
                    label="Realm Name"
                    name="realm"
                    value={realm}
                    onChange={(r) => setRealm(r.target.value)}
                  />
                </Grid>
              
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="gm_name"
                    label="Guild Master"
                    name="gm_name"
                    value={gm_name}
                    onChange={(t) => setGuildMaster(t.target.value)}
                  />
                </Grid>
                
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Submit Guild
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={handleGoBack} >
                  Already have a Guild? Go back
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
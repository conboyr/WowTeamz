import React, { useState, useEffect } from "react";
import API from "../../API_Interface/API_Interface";
import {
  Avatar, Box, Button, Checkbox, InputLabel, MenuItem, FormHelperText, FormControl, Select, CssBaseline, Divider, FormControlLabel,
  Grid, Link, Paper, TextField, Typography, createTheme, ThemeProvider
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from '@mui/material/Container';


const defaultTheme = createTheme();

export default function SignUp({setMakeRaidMode}) {
  const [teamName, setTeamName] = useState("");
  const [numPlayers, setNumPlayers] = useState("");
  const [raidDay_A, setRaidDayA] = useState("");
  const [raidDay_B, setRaidDayB] = useState("");
  const [raidTime, setRaidTime] = useState("");
  const [exist, setExist] = useState(true);
  const [raidCheck, setRaidCheck] = useState(false);


  const handleSubmit = () => {
    console.log('Submit Raid Team Called');
    setRaidCheck(true);
  };

  const handleGoBack = () => {
    console.log('Raid Mode called');
    setMakeRaidMode(false);
  };


  // CHECK FOR RAID

  useEffect(() => {
    if (teamName.length === 0) return;
    const api = new API();
    async function checkRaidName() {
        api.checkRaidName(teamName)
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

    checkRaidName();
  }, [raidCheck]);

  // ADD TO DATABASE 

  useEffect(() => {
    if (teamName.length === 0 || numPlayers.length === 0 || raidTime.length === 0) return;
    const api = new API();
    async function createRaidTeam() {
        api.createRaidTeam(teamName, numPlayers, raidDay_A, raidDay_B, raidTime)
        .then( newUserInfo => {
        console.log(`API returns user info and it is: ${JSON.stringify(newUserInfo)}`);
        if (newUserInfo.data.status === "OK") {
          alert("Raid Team Created!");
          setMakeRaidMode(false);
        } else {
          alert("Creation NOT Sucessful");
        }
      });
    }

    createRaidTeam();
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
            Create Raid Team
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="teamName"
                  label="Team Name"
                  name="teamName"
                  value={teamName}
                  onChange={(n) => setTeamName(n.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="numPlayers"
                  label="Raid Team Size"
                  name="numPlayers"
                  value={numPlayers}
                  onChange={(p) => setNumPlayers(p.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="rd1">Raid Day 1</InputLabel>
                    <Select
                    id="rd1"
                    value={raidDay_A}
                    label="Raid Day 1"
                    onChange={(a) => setRaidDayA(a.target.value)}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Monday'}>Monday</MenuItem>
                    <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                    <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
                    <MenuItem value={'Thursday'}>Thursday</MenuItem>
                    <MenuItem value={'Friday'}>Friday</MenuItem>
                    <MenuItem value={'Saturday'}>Saturday</MenuItem>
                    <MenuItem value={'Sunday'}>Sunday</MenuItem>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="rd2">Raid Day 2</InputLabel>
                        <Select
                        id="rd2"
                        value={raidDay_B}
                        label="Raid Day 2"
                        onChange={(b) => setRaidDayB(b.target.value)}
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Monday'}>Monday</MenuItem>
                        <MenuItem value={'Tuesday'}>Tuesday</MenuItem>
                        <MenuItem value={'Wednesday'}>Wednesday</MenuItem>
                        <MenuItem value={'Thursday'}>Thursday</MenuItem>
                        <MenuItem value={'Friday'}>Friday</MenuItem>
                        <MenuItem value={'Saturday'}>Saturday</MenuItem>
                        <MenuItem value={'Sunday'}>Sunday</MenuItem>
                        </Select>
                    <FormHelperText>Select 'None' if only 1 raid day</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="raidTime"
                  label="Time of Raid"
                  name="raidTime"
                  value={raidTime}
                  onChange={(t) => setRaidTime(t.target.value)}
                />
                </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Submit Raid Team
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link variant="body2" onClick={handleGoBack} >
                  Already have a Raid Team? Go back
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}
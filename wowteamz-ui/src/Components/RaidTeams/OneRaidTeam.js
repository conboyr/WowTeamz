import React, { Fragment, useState } from 'react';
//import Calendar from '../Calendar/Calendar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add'; // Make sure to import AddIcon
import Grid from '@mui/material/Grid';
import { BarChart } from '@mui/x-charts/BarChart';
import { Divider } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import Character from "../Characters/Characters";

export default function OneRaidTeam({ raid, chars}) {
    // Assuming you manage the state of adding a character to the raid
    const [addCharMode, setAddCharMode] = useState(false);
    const [viewCharacters, setViewCharacters] = useState(false);

    const roleCount = {};
    
    chars.forEach(character => {
        const role = character.role;
        roleCount[role] = (roleCount[role] || 0) + 1;
    });

    console.log(roleCount)

    return (
        <Fragment>
            
            <Grid container spacing={2}>
                <Grid item xs={3} sm={3}>
                    <Typography component="h3">
                        Team Name: {raid.teamName} 
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="h3">
                        Raid Days: {raid.raidDay_A} / {raid.raidDay_B} 
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="h3">
                        Raid Time: {raid.raidTime}
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="h3">
                        Team Size: {raid.numPlayers}
                    </Typography>
                </Grid>
            </Grid>

            <Divider />
            
                    
                
            <BarChart
                series={[
                    { data: chars.map(char => char.gearScore) } // Array of gear scores for each character
                ]}
                height={300}
                xAxis={[
                    { 
                        data: chars.map(char => char.name), 
                        scaleType: 'band',
                        tickLabelAngle: -45, // Rotate labels by -45 degrees
                        tickLabelProps: () => ({
                            textAnchor: 'end', // Align text to the end of the tick
                            fontSize: '10px', // Adjust font size if necessary
                            dy: '0.5em' // Adjust vertical position of label
                        })
                    }
                ]}
                margin={{ top: 10, bottom: 60, left: 40, right: 10 }} // Increase bottom margin to accommodate rotated labels
                />  

                


            <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                <PieChart
                    series={[
                        {
                            data: Object.keys(roleCount).map(role => ({
                                id: role,
                                value: roleCount[role],
                                label: `${role}: ${roleCount[role]}`
                            }))
                        }
                    ]}
                    width={400}
                    height={200}
                />

                </Grid>
                <Grid item xs={6} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                            variant="outlined"
                            color="success"
                            onClick={() => setViewCharacters(true)}  // Set state to show characters
                        >
                            View Characters
                            <IconButton
                                aria-label="add character"
                                size="large"
                                color="success"
                                sx={{ fontSize: '2rem', ml: 1 }}
                            >
                                <AddIcon sx={{ fontSize: 'inherit' }} />
                            </IconButton>
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            {/* Conditionally Render Character Component with Raid ID */}
            {viewCharacters && (
                <Character raidID={raid.raidTeam_id} />  // Pass the raid ID to the Character component
            )}
        </Fragment>
    )
}

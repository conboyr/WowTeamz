import React, { Fragment } from 'react';
import Calendar from '../Calendar/Calendar';
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
export default function OneRaidTeam({ raid }) {
    // Assuming you manage the state of adding a character to the raid
    //const [addCharMode, setAddCharMode] = React.useState(false);

    const [viewCharacters, setViewCharacters] = React.useState(false);
    return (
        <Fragment>
            
            <Grid container spacing={2}>
                <Grid item xs={3} sm={3}>
                    <Typography component="div">
                        Team Name: {raid.teamName} 
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="div">
                        Raid Days: {raid.raidDay_A} / {raid.raidDay_B} 
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="div">
                        Raid Time: {raid.raidTime}
                    </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                    <Typography component="div">
                        Team Size: {raid.numPlayers}
                    </Typography>
                </Grid>
            </Grid>

            <Divider />

            <PieChart
                series={[
                    {
                    data: [
                        { id: 0, value: 10, label: 'series A' },
                        { id: 1, value: 15, label: 'series B' },
                        { id: 2, value: 20, label: 'series C' },
                    ],
                    },
                ]}
                width={400}
                height={200}
/>


            <BarChart
            series={[
                { data: [35, 44, 24, 34] },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />


            <Grid container spacing={2}>
                <Grid item xs={6}>
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
    );
}
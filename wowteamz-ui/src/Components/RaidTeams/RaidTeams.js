import React, { Fragment, useState } from 'react';
import MakeRaidTeam from './MakeRaidTeam';
import CharsForRaidTeam from './CharsForRaidTeam';
import AddCharToTeam from './AddCharToTeam';

export default function RaidTeams() {
    
    const [makeRaidMode, setMakeRaidMode] = useState(false);    
    const [addCharMode, setAddCharMode] = useState(false);

    return (
        <Fragment>
            {
                makeRaidMode ? (
                <MakeRaidTeam setMakeRaidMode={setMakeRaidMode} />
            ) : addCharMode ? (
                <AddCharToTeam setAddCharMode={setAddCharMode}/>
            )  :    (
                <CharsForRaidTeam setMakeRaidMode={setMakeRaidMode} setAddCharMode={setAddCharMode}/>
            )
        
            }
        </Fragment>
    );
}

import React, { Fragment, useState } from 'react';
import MakeRaidTeam from './MakeRaidTeam';
import CharsForRaidTeam from './CharsForRaidTeam';

export default function RaidTeams() {
    
    const [makeRaidMode, setMakeRaidMode] = useState(false);    

    return (
        <Fragment>
            {
                makeRaidMode ? (
                <MakeRaidTeam setMakeRaidMode={setMakeRaidMode}/>
            ) : (
                <CharsForRaidTeam setMakeRaidMode={setMakeRaidMode} />
            )
        
            }
        </Fragment>
    );
}

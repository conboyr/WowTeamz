import React, { Fragment, useState } from 'react';
import MakeRaidTeam from './MakeRaidTeam';
import CharsForRaidTeam from './CharsForRaidTeam';
import AddCharToTeam from './AddCharToTeam';
import OneRaidTeam from './OneRaidTeam';

export default function RaidTeams() {
    
    const [makeRaidMode, setMakeRaidMode] = useState(false);    
    const [addCharMode, setAddCharMode] = useState(false);
    const [raid, setRaid] = useState(undefined);
    const [chars, setChars] = useState([]);
    const [oneRaidMode, setOneRaidMode] = useState(false);

    return (
        <Fragment>

            {   
                oneRaidMode ? (
               <OneRaidTeam raid={raid} chars={chars} /> 
            )
              :  makeRaidMode ? (
                <MakeRaidTeam setMakeRaidMode={setMakeRaidMode} />
            ) : addCharMode ? (
                <AddCharToTeam setAddCharMode={setAddCharMode}/>
            )  :    (
                <CharsForRaidTeam 
                    setOneRaidMode={setOneRaidMode} 
                    setRaid={setRaid}
                    setChars={setChars}
                    setMakeRaidMode={setMakeRaidMode} 
                    setAddCharMode={setAddCharMode} 
                />
            )
        
            }
        </Fragment>
    );
}

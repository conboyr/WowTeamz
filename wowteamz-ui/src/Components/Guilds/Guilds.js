import React, { Fragment, useState } from 'react';
import MakeGuild from './MakeGuild';
import RaidsForGuild from './RaidsForGuild';

//import AddCharToTeam from './AddCharToTeam';
//import OneRaidTeam from './OneRaidTeam';

export default function Guilds( {account_id} ) {
    const [makeGuildMode, setMakeGuildMode] = useState(false);    

    return (
        <Fragment>

            {   
             makeGuildMode ? (
                <MakeGuild account_id={account_id} setMakeGuildMode={setMakeGuildMode} />
            ) :    (
                <RaidsForGuild account_id={account_id} setMakeGuildMode={setMakeGuildMode}/>
            )
        
            }
        </Fragment>
    );
}

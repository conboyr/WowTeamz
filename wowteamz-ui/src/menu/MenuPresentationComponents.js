import Accounts from '../Components/Accounts/Accounts';
import Characters from '../Components/Characters/Characters';
import RaidTeams from '../Components/RaidTeams/RaidTeams';
import Summary from '../Components/SummaryPage/Summary';
import Guild from '../Components/Guilds/Guilds'

const presentationComponents = (props) => {
    return [
        {
            title: 'Home',
            component: <Summary/>
        },
        {
            title: 'Guild',
            component: <Guild/>
        },
        {
            title: 'Raid Team',
            component: <RaidTeams/>
        },
        {
            title: 'Account',
            component: <Accounts/>
        },
        {
            title: 'Add Character',
            component: <Characters/>
        },
    ];
};


export {presentationComponents};

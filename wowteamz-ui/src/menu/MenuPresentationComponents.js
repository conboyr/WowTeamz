import Accounts from '../Components/Accounts/Accounts';
import Characters from '../Components/Characters/Characters';
import RaidTeams from '../Components/RaidTeams/RaidTeams';
import Summary from '../Components/SummaryPage/Summary';

const presentationComponents = (props) => {
    return [
        {
            title: 'Summary',
            component: <Summary/>
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

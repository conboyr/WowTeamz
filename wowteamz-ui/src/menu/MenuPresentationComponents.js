import Accounts from '../Components/Accounts/Accounts';
import Characters from '../Components/Characters/Characters';
import RaidTeams from '../Components/RaidTeams/RaidTeams';
import Markets from '../Components/Markets/Markets';
import Transactions from '../Components/Transactions/Transactions';
import Summary from '../Components/SummaryPage/Summary';

const presentationComponents = (props) => {
    return [
        {
            title: 'Summary',
            component: <Summary/>
        },
        {
            title: 'Markets',
            component: <Markets/>
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
        {
            title: 'Transactions',
            component: <Transactions />
        },
    ];
};


const containerComponents = (props) => {
    return [
        {
            title: 'Activities',
            component: <Transactions />
        }
    ];
};

export {presentationComponents, containerComponents};

import React, {useState, useEffect, Fragment} from 'react';
import API from '../../API_Interface/API_Interface'


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const routesTableAttributes = [
    {
        title: 'Route Name',
        attributeDBName: 'routeName',
        align: 'left'
    },
    {
        title: 'Route ID',
        attributeDBName: 'routeID',
        align: 'left'
    },
    {
        title: 'Cycle ID',
        attributeDBName: 'cycleID',
        align: 'left'
    },
    {
        title: 'Date Created',
        attributeDBName: 'dateCreated',
        align: 'left'
    }
];

export default function RouteTable(props) {


    const [routes, setRoutes] = useState([]);
    console.log(`in RouteTTable routes contains is ${JSON.stringify(routes)}`);


    useEffect(() => {
        const api = new API();

        async function getRoutes() {
            const routesJSONString = await api.allRoutes();
            console.log(`routes from the DB ${JSON.stringify(routesJSONString)}`);
            setRoutes(routesJSONString.data);
        }

        getRoutes();
    }, []);

    const TRow = ({routeObject}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                routesTableAttributes.map((attr, idx) =>
                    <TableCell key={idx}
                               align={attr.align}>
                        {
                            routeObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }

    return <Fragment>
        {
            routes.length > 0 &&
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="route table">
                        <TableHead>
                            <TableRow>
                                {
                                    routesTableAttributes.map((attr, idx) =>
                                        <TableCell  key={idx}
                                                    align={attr.align}>
                                            {attr.title}
                                        </TableCell>)
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                routes.map((route, idx) => (
                                    <TRow routeObject={route} key={idx}/>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
        }
    </Fragment>
}
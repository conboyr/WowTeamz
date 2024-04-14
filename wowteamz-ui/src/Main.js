import React, { Fragment, useState } from 'react';
import Login from './Login';
import App from './App';

const logout = (setUser) => {
    return () => {
        setUser(undefined);
    }
};

export default function Main() {

    const [user, setUser] = useState(undefined);

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <App user={user} logoutAction={logout(setUser)} />
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
        </Fragment>
    )

}

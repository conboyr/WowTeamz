import React, { Fragment, useState } from 'react';
import Login from './Login';
import App from './App';
import Signup from './Signup';

export default function Main() {
    const [user, setUser] = useState(undefined);
    const [signupMode, setSignupMode] = useState(false);

    const logout = (setUser) => {
        return () => {
            setUser(undefined);
        }
    };

    

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <App user={user} logoutAction={logout(setUser)} />
                ) : (
                    signupMode ? (
                        <Signup user={user} setUser={setUser} setSignupMode={setSignupMode}/>
                    ) : (
                        <Login user={user} setUser={setUser} setSignupMode={setSignupMode} />
                    )
                )
            }
        </Fragment>
    );
}

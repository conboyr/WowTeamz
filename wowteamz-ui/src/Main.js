import React, { Fragment, useState } from 'react';
import Login from './Login';
import App from './App';
import Signup from './Signup';

export default function Main({account_id}) {
    const [user, setUser] = useState(undefined);
    const [signupMode, setSignupMode] = useState(false);

    const logout = (setUser) => {
        return () => {
            setUser(undefined);
        }
    };
    console.log("in Main:");
    console.log(account_id);
    

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <App user={user} logoutAction={logout(setUser)} account_id={account_id}/>
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

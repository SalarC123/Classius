import { BrowserRouter, Route } from "react-router-dom";
import './index.css' // tailwind
import GroupPage from './components/GroupPage'
import Register from "./components/Register";
import Login from "./components/Login";
import GuardedRoute from './components/GuardedRoute'
import HomePage from './components/HomePage'
import { useEffect, useState } from "react";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState("")

    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => setIsLoggedIn(data.isLoggedIn))
    }, [])

    return (
        <div>
            <BrowserRouter>
                <Route component={Register} exact path="/register"/>
                <Route component={Login}  exact path="/login"/>
                <GuardedRoute component={GroupPage} isLoggedIn={isLoggedIn} exact path="/g/:groupId" />
                
                {/* <Route exact path="/" component={HomePage}/> */}
                <GuardedRoute component={HomePage} isLoggedIn={isLoggedIn} exact path="/"/>
            </BrowserRouter>
        </div>
    );
}

export default App;

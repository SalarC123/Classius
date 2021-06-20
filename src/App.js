import { BrowserRouter, Route } from "react-router-dom";
import './index.css' // tailwind
import GroupPage from './components/GroupPage'
import Register from "./components/Register";
import Login from "./components/Login";
import HomePage from './components/HomePage'
import PageNotFound from './components/PageNotFound'
import ProfilePage from './components/ProfilePage'

function App() {
    return (
        <div className="bg-gray-900">
            <BrowserRouter>
                <Route component={Register} exact path="/register"/>
                <Route component={Login}  exact path="/login"/>
                <Route component={GroupPage} exact path="/g/:groupId" />
                <Route component={ProfilePage} exact path="/u/:userId" />
                <Route component={HomePage} exact path="/"/>
                {/* <Route component={PageNotFound}/> */}
            </BrowserRouter>
        </div>
    );
}

export default App;

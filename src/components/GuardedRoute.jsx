import { Route, Redirect } from 'react-router-dom'

function GuardedRoute({ component: Component, isLoggedIn, ...rest }) {
    
    return <Route {...rest} render={props => (
        isLoggedIn ? <Component {...props}/>: <Redirect to="/login"/>
    )} /> 
}

export default GuardedRoute;
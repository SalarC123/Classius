import { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom'

function Login() {

    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory()

    async function handleLogin(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            username: form[0].value,
            password: form[1].value
        }

        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const data = await res.json()
        localStorage.setItem("token", data.token)
        setErrorMessage(data.message)
    }

    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? history.push("/"): null)
    }, [])

    return (
        <div>
            <div>Login</div>
            <form onSubmit={(e) => handleLogin(e)}>
                <label htmlFor="username">Username</label>
                <input type="text" required name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" required name="password" id="password" />
                <input type="submit" value="Login"/>
                <Link to="/register">Register</Link>
            </form>
            {errorMessage === "Success" ? <Redirect to="/"/>: <div>{errorMessage}</div>}
        </div>
    )
}

export default Login;
import { useState } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import { useEffect } from 'react'

function Register () {

    const [errorMessage, setErrorMessage] = useState("")
    const history = useHistory()

    async function handleLogin(e) {
        e.preventDefault()

        const form = e.target
        const user = {
            username: form[0].value,
            email: form[1].value,
            password: form[2].value
        }

        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const data = await res.json()
        setErrorMessage(data.message)
    }

    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? history.push("/"): console.log("Not Logged In"))
    }, [])

    return (
        <div>
            <div>Register</div>
            <form onSubmit={(e) => handleLogin(e)}>
                <label htmlFor="username">Username</label>
                <input type="text" required name="username" id="username" />
                <label htmlFor="email">Email</label>
                <input type="email" required name="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" required name="password" id="password" />
                <input type="submit" value="Register" />
                <Link to="/login">Login</Link>
                {errorMessage === "Success" ? <Redirect to="/login"/>: <div>{errorMessage}</div>}
            </form>
        </div>
    )
}
export default Register
import { useLayoutEffect, useState  } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom'
import ValidationError from './ValidationError'

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

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? history.push("/dashboard"): null)
    }, [])

    return (
        <div className="text-white flex flex-col h-screen w-screen items-center justify-center">
            <div className="p-5 text-3xl font-extrabold">Login</div>
            <form className="mx-5 flex flex-col w-72" onSubmit={(e) => handleLogin(e)}>
                <label htmlFor="username">Username</label>
                <input className="text-black m-3 border-2 border-green-400 p-1" type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input className="text-black m-3 border-2 border-green-400 p-1" type="password" name="password" id="password" />
                <input className="m-1 px-2 py-1 rounded font-bold text-xl bg-green-400 text-gray-900" type="submit" value="Login"/>
                <div className="flex flex-row items-center justify-center">
                    <h1>Don't have an account?</h1>
                    <Link className="m-1 px-2 py-1 rounded font-bold text-xl border-2 border-green-400 text-green-400 text-center" to="/register">Register</Link>
                </div>            </form>
            {errorMessage === "Success" ? <Redirect to="/dashboard"/>: <ValidationError message={errorMessage} />}
        </div>
    )
}

export default Login;
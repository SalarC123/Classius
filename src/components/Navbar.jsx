import { useHistory, Link } from "react-router-dom";
import { useLayoutEffect, useState } from 'react'

function Navbar() {

    const history = useHistory()
    const [username, setUsername] = useState("")

    async function logout() {
        localStorage.removeItem("token")
        await history.push("/login")
    }

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setUsername(data.username): history.push("/login"))
    }, [])

    return (
        <div className="flex flex-row p-10 justify-center text-2xl text-white">
            <div className="mx-10 hover:text-green-300"><Link to="/">Home</Link></div>
            <div className="mx-10 hover:text-green-300"><Link to="/login">Login</Link></div>
            <div className="mx-10 hover:text-green-300"><Link to="/register">Register</Link></div>
            <div className="cursor-pointer mx-10 hover:text-green-300" onClick={logout}>Logout</div>
            <Link to={"/u/" + username} className="cursor-pointer mx-10 hover:text-green-300">Profile</Link>
        </div>
    )
}

export default Navbar;
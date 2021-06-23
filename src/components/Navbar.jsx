import { useHistory, Link } from "react-router-dom";
import { useLayoutEffect, useState } from 'react'

function Navbar() {

    const history = useHistory()
    const [username, setUsername] = useState(null)

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
        .then(data => data.isLoggedIn ? setUsername(data.username): null)
    }, [])

    return (
        <div className="flex flex-row p-10 justify-end text-2xl text-white">
            <a href="/dashboard" className="mr-auto font-extrabold text-2xl">Classius</a>
            <div className="hidden sm:flex mx-3 hover:text-green-300"><Link to="/dashboard">Home</Link></div>
            {username  
                ? <div className="hidden sm:flex">
                    <Link to={"/u/" + username} className="cursor-pointer mx-3 hover:text-green-300">Profile</Link>
                    <div className="cursor-pointer mx-3 hover:text-green-300" onClick={logout}>Logout</div>
                  </div>  
                : <div className="hideen sm:flex">
                    <div className="mx-3 px-2 py-1 rounded font-bold text-xl bg-green-400 text-gray-900"><Link to="/login">Login</Link></div>
                    <div className="mx-3 px-2 py-1 rounded font-bold text-xl border-2 border-green-400 text-green-400"><Link to="/register">Register</Link></div>
                  </div>
            }
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 flex sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>
    )
}

export default Navbar;
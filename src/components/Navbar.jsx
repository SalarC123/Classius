import { useHistory, Link } from "react-router-dom";
import { useLayoutEffect, useState } from 'react'

function Navbar() {

    const history = useHistory()
    const [username, setUsername] = useState(null)
    const mobileMenuMargin = "fullscreen"
    const [mobileMenuPosition, setMobileMenuPosition] = useState(mobileMenuMargin)

    async function logout() {
        localStorage.removeItem("token")
        await history.push("/login")
    }

    useLayoutEffect(() => {
        fetch("/api/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setUsername(data.username): null)
        .catch(err => alert(err)) 
    }, [])

    function toggleMobileMenu() {
        /*
            PurgeCSS: 
            * -my-fullscreen
            * -my-0
        */
        if (mobileMenuPosition === mobileMenuMargin) {
            setMobileMenuPosition("0")
        } else {
            setMobileMenuPosition(mobileMenuMargin)
        }
    }

    return (
        <>
            <section className={`text-white flex flex-col w-screen justify-cay-900`}>
enter items-center sm:hidden fixed transition-all duration-500 -my-${mobileMenuPosition} z-30 h-screen bg-gr                <div className="mx-3 text-3xl hover:text-green-300"><Link to="/dashboard">Home</Link></div>
                <div className="mx-3 text-3xl hover:text-green-300 mt-10"><Link to="/FAQ">FAQ</Link></div>
                {username  
                    ? <div className="text-3xl flex flex-col">
                        <Link to={"/u/" + username} className="my-10 cursor-pointer mx-3 hover:text-green-300">Profile</Link>
                        <div className="cursor-pointer mx-3 hover:text-green-300" onClick={logout}>Logout</div>
                    </div>  
                    : <div className="flex my-10">
                        <div className="mx-3 px-2 py-1 rounded font-bold text-xl bg-green-400 text-gray-900"><Link to="/login">Login</Link></div>
                        <div className="mx-3 px-2 py-1 rounded font-bold text-xl border-2 border-green-400 text-green-400"><Link to="/register">Register</Link></div>
                    </div>
                }
            </section>
            <div className="flex flex-row p-10 justify-end text-2xl text-white">
                <a href="/" className="mr-auto font-extrabold text-2xl z-50">Classius</a>
                <div className="hidden sm:flex mx-3 hover:text-green-300"><Link to="/dashboard">Home</Link></div>
                <div className="hidden sm:flex mx-3 hover:text-green-300"><Link to="/FAQ">FAQ</Link></div>
                {username  
                    ? <div className="hidden sm:flex">
                        <Link to={"/u/" + username} className="cursor-pointer mx-3 hover:text-green-300">Profile</Link>
                        <div className="cursor-pointer mx-3 hover:text-green-300" onClick={logout}>Logout</div>
                    </div>  
                    : <div className="hidden sm:flex">
                        <div className="mx-3 px-2 py-1 rounded font-bold text-xl bg-green-400 text-gray-900"><Link to="/login">Login</Link></div>
                        <div className="mx-3 px-2 py-1 rounded font-bold text-xl border-2 border-green-400 text-green-400"><Link to="/register">Register</Link></div>
                    </div>
                }
                <svg onClick={toggleMobileMenu} xmlns="http://www.w3.org/2000/svg" className="z-50 h-9 w-9 flex sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </div>
        </>
    )
}

export default Navbar;
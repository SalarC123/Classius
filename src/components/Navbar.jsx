import { useHistory, Link } from "react-router-dom";

function Navbar() {

    const history = useHistory()

    async function logout() {
        localStorage.removeItem("token")
        await history.push("/login")
    }

    return (
        <div className="flex flex-row p-10 justify-center text-2xl text-white">
            <div className="mx-10 hover:text-green-300"><Link to="/login">Login</Link></div>
            <div className="mx-10 hover:text-green-300"><Link to="/register">Register</Link></div>
            <div className="cursor-pointer mx-10 hover:text-green-300" onClick={logout}>Logout</div>
        </div>
    )
}

export default Navbar;
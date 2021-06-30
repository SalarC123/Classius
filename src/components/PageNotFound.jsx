import pagenotfound from '../assets/pagenotfound.svg'
import {Link} from 'react-router-dom'

function PageNotFound() {

    return (
        <div className="h-screen -my-12 flex flex-col items-center justify-center">
            <p className="text-white p-5 text-3xl sm:text-5xl font-extrabold">Page Not Found</p>
            <Link to="/dashboard" className="text-2xl underline text-green-400">Return Home</Link>
            <img className="p-5" src={pagenotfound} alt="404 Error" />
        </div>
    )
}

export default PageNotFound;
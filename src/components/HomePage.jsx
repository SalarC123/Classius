import CourseForm from './CourseForm'
import GroupSearch from './GroupSearch'
import Groups from './Groups'
import { Link, useHistory } from 'react-router-dom'

function HomePage() {

    const history = useHistory()

    function logout() {
        localStorage.removeItem("token")
        history.push("/login")

        // redirect on click with redirect component
    }

    return (
        <div>
            <div className="m-8 border-4 border-black">
                <div>
                    <Link to="/login">Login</Link>
                </div>
                <div>
                    <Link to="/register">Register</Link>
                </div>
                <div className="cursor-pointer" onClick={logout}>Logout</div>
            </div>

            <CourseForm/>
            <GroupSearch/>
            <Groups/>
        </div>
    )
}

export default HomePage
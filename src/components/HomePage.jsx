import CourseForm from './CourseForm'
import GroupSearch from './GroupSearch'
import Groups from './Groups'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'

function HomePage() {

    const [username, setUsername] = useState(null)

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

    return (
        <div className="bg-gray-900">
            <Navbar/>
            {username 
                ? <h1 className="text-center font-extrabold m-8 text-green-400 text-3xl">Welcome, {username}</h1>
                : null
            }
            <GroupSearch/>
            {username
                ? <CourseForm/>
                : null
            }
            <Groups/>   
        </div>
    )
}

export default HomePage
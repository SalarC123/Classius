import CourseForm from './CourseForm'
import GroupSearch from './GroupSearch'
import Groups from './Groups'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'

function HomePage() {

    const [username, setUsername] = useState(null)

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
        <div className="bg-gray-900 min-h-screen">
            <Navbar/>
            {username
                ? <>
                    <h1 className="font-extrabold m-8 text-green-400 text-3xl">Welcome, {username}</h1>
                    <CourseForm/>
                  </>
                : null
            }
            <GroupSearch/>
            <Groups/>   
        </div>
    )
}

export default HomePage
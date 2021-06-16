import CourseForm from './CourseForm'
import GroupSearch from './GroupSearch'
import Groups from './Groups'
import { Link, useHistory } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'

function HomePage() {

    const history = useHistory()
    const [username, setUsername] = useState("")

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
        <div>
            <Navbar/>

            <h1 className="font-extrabold m-8 text-green-400 text-3xl">Welcome, {username}</h1>

            <CourseForm/>
            <GroupSearch/>
            <Groups/>
        </div>
    )
}

export default HomePage
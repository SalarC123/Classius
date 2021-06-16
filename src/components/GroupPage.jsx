import { useEffect, useState, useLayoutEffect } from "react";
import { useHistory } from 'react-router-dom'

function GroupPage({ match }) {

    const history = useHistory()

    const groupId = match.params.groupId
    const [group, setGroup] = useState({})

    useEffect(() => {
        fetch("/g/" + groupId)
        .then(res => res.json())
        .then(data => setGroup(data[0]))
    }, [])

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? null: history.push("/login"))
    }, [])

    async function updateLikes(groupName, course) {
        const res = await fetch("/updateLikes", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
            }, 
            body: JSON.stringify({groupName: groupName, course: course})
        })
        
    }

    // FIX ERROR WHEN GROUP IS UNDEFINED (Error Boundary)

    return (
        <div className="text-white">
            <div>{group.groupName}</div>
            {group.courses
                ? group.courses.map(course => (
                    <div className="m-8">
                        <div>{course.url}</div>
                        <button onClick={() => updateLikes(group.groupName, course)}>{course.likeCount}</button>
                    </div>
                ))
                : <div>Loading...</div>
            }
        </div>
    )
}

export default GroupPage;
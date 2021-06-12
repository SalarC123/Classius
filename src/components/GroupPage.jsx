import { useEffect, useState } from "react";

function GroupPage({ match }) {

    const groupId = match.params.groupId
    const [group, setGroup] = useState({})

    useEffect(() => {
        fetch("/g/" + groupId)
        .then(res => res.json())
        .then(data => setGroup(data[0]))
    }, [])

    async function updateLikes(groupName, course) {
        const res = await fetch("/updateLikes", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            }, 
            body: JSON.stringify({groupName: groupName, course: course})
        })
    }

    // FIX ERROR WHEN GROUP IS UNDEFINED (Error Boundary)

    return (
        <div>
            <div>{group.groupName}</div>
            {group.courses
                ? group.courses.map(course => (
                    <div className="m-8">
                        <div>{course.url}</div>
                        <button onClick={() => updateLikes(group.groupName, course)}>{course.likes}</button>
                    </div>
                ))
                : <div>Loading...</div>
            }
        </div>
    )
}

export default GroupPage;
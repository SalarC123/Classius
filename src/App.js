import { useEffect, useState } from "react";
import { ReactTinyLink } from 'react-tiny-link'

function App() {
    const [groups, setGroups] = useState([])

    async function handleSubmit(e) {
        e.preventDefault();
        const courses = []
        const form = e.target
        const groupName = form[0].value

        for (let i = 1; i < form.length - 1; i++) {
            courses.push({url: form[i].value})
        }

        const groupFormData = {groupName: groupName, courses: courses}

        let res = await fetch("/creategroup", {
            method:"POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(groupFormData)
        })
    }

    useEffect(() => {
        fetch("/courses")
        .then(res => res.json())
        .then(data => {
            setGroups(data)
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <div className="">
            <form className="m-10 text-md font-extrabold" onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="group-name">First Name</label>
                <input id="group-name" name="group-name" type="text" />
                <label htmlFor="course-one">URL of Course 1</label>
                <input id="course-two" name="course-one" type="url" />
                <label htmlFor="course-one">URL of Course 2</label>
                <input id="course-two" name="course-two" type="url" />
                <input type="submit" value="Submit" />
            </form>

            {groups.map((group) => {
                return (
                    <div>
                        <h1>{group.groupName}</h1>
                        {group.courses.map(course => {
                            // do open graph stuff here
                            return (
                                <ReactTinyLink
                                    cardSize="small"
                                    showGraphic={true}
                                    maxLine={2}
                                    minLine={1}
                                    url={course.url || "https://en.wikipedia.org/wiki/HTTP_404"}
                                />
                            )
                        })}
                    </div>
                )
            })}

        </div>
    );
}

export default App;

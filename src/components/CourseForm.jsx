import { useState } from "react";

function CourseForm() {

    const [errorMessage, setErrorMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        const courses = []
        const form = e.target
        const groupName = form[0].value

        for (let i = 1; i < form.length - 1; i++) {
            courses.push({url: form[i].value, likes: 0, likesUpdated: false})
        }

        const groupFormData = {groupName: groupName, courses: courses}

        let res = await fetch("/creategroup", {
            method:"POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(groupFormData)
        })
        const data = await res.json()
        setErrorMessage(data.message)
        
    }

    return (
        <form className="m-10 text-md font-extrabold border-4 p-6 border-black" onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="group-name">Group Name</label>
            <input className="m-2 border-2 border-yellow-300 p-2" id="group-name" name="group-name" type="text" pattern="^[a-zA-Z0-9 ]+$" required/>
            <label htmlFor="course-one">URL of Course 1</label>
            <input className="m-2 border-2 border-yellow-300 p-2" id="course-two" name="course-one" type="url" required />
            <label htmlFor="course-one">URL of Course 2</label>
            <input className="m-2 border-2 border-yellow-300 p-2" id="course-two" name="course-two" type="url" required />
            <input type="submit" value="Submit" />

            {errorMessage ? <div>{errorMessage}</div>: null}
        </form>
    )
}

export default CourseForm
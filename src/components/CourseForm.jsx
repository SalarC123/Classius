import { useState } from "react";

function CourseForm() {

    const [errorMessage, setErrorMessage] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        const courses = []
        const form = e.target
        const groupName = form[0].value

        for (let i = 1; i < form.length - 1; i++) {
            courses.push({url: form[i].value, likeCount: 0, likers: []})
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
        <form className="flex flex-col m-10 text-md border-4 p-6 border-black text-white" onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="group-name">Group Name</label>
            <input className="m-2 border-2 border-green-400 p-2 text-black" id="group-name" name="group-name" type="text" pattern="^[a-zA-Z0-9 ]+$" required/>
            <label htmlFor="course-one">URL of Course 1</label>
            <input className="m-2 border-2 border-green-400 p-2 text-black" id="course-two" name="course-one" type="url" required />
            <label htmlFor="course-one">URL of Course 2</label>
            <input className="m-2 border-2 border-green-400 p-2 text-black" id="course-two" name="course-two" type="url" required />
            <input className="px-3 py-1 my-6 text-gray-900 bg-green-400 text-xl font-extrabold rounded-xl" type="submit" value="Submit" />

            {errorMessage ? <div>{errorMessage}</div>: null}
        </form>
    )
}

export default CourseForm
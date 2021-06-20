import { useState } from "react";
import { Redirect } from "react-router";
import ValidationError from "./ValidationError";

function CourseForm() {

    const [errorMessage, setErrorMessage] = useState("")
    const [inputCourses, setInputCourses] = useState([1, 2])
    const [groupURL, setGroupURL] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        const courses = []
        const form = e.target
        const groupName = form[0].value

        // only takes form inputs that have course URLs
        for (let i = 1; i < form.length - 3; i++) {
            // courses.push({url: form[i].value, likeCount: 0, likers: []})
            courses.push(form[i].value)
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
        setGroupURL(data.groupURL)
        setErrorMessage(data.message)
        
    }

    function removeCourseInput() {
        inputCourses.length > 2
        ? setInputCourses(inputCourses.slice(0, inputCourses.length - 1))
        : console.log("No less than 2 courses are allowed per group")
    }

    function addCourseInput() {
        inputCourses.length < 10
        ? setInputCourses([...inputCourses, inputCourses[inputCourses.length-1]+1])
        : console.log("No more than 10 courses are allowed per group")
    }

    return (
        <form className="flex flex-col m-10 text-md border-4 p-6 border-white text-white" onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="group-name">Group Name</label>
            <input className="m-2 border-2 border-green-400 p-2 text-black" id="group-name" name="group-name" type="text" pattern="^[a-zA-Z0-9 ]+$" required/>
            {inputCourses.map(courseNum => (
                <>
                    <label htmlFor="course-one">URL of Course {courseNum}</label>
                    <input className="m-2 border-2 border-green-400 p-2 text-black" id="course-two" name="course-one" type="url" required /> 
                </>
            ))}
            <input className="px-3 py-1 my-6 text-gray-900 bg-green-400 text-xl font-extrabold rounded-xl" type="submit" value="Submit" />

            <button onClick={addCourseInput}>
                Add Course
            </button>
            <button onClick={removeCourseInput}>
                Remove Course
            </button>
            {errorMessage === "Success" ? <Redirect to={"/g/" + groupURL} />: <ValidationError message={errorMessage}/>}
        </form>
    )
}

export default CourseForm
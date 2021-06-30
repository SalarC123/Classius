import { useState } from "react";
import { Redirect } from "react-router";
import ValidationError from "./ValidationError";
import LoadingModal from './LoadingModal'

function CourseForm() {

    const [errorMessage, setErrorMessage] = useState("")
    const [inputCourses, setInputCourses] = useState([1, 2])
    const [groupURL, setGroupURL] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault();
        setIsOpen(true)
        const courses = []
        const form = e.target
        const groupName = form[0].value

        // only takes form inputs that have course URLs
        for (let i = 1; i < form.length - 3; i++) {
            // courses.push({url: form[i].value, likeCount: 0, likers: []})
            courses.push(form[i].value)
        }

        const groupFormData = {groupName: groupName, courses: courses}

        try {
            let res = await fetch("/creategroup", {
                method:"POST",
                headers: {
                    'Content-type': 'application/json',
                    "x-access-token": localStorage.getItem("token")
                },
                body: JSON.stringify(groupFormData)
            })
            const data = await res.json()
            setGroupURL(data.groupURL)
            setErrorMessage(data.message)
            if (data.message !== "Success") {
                setIsOpen(false)
            } 
        } catch (err) {
            setErrorMessage(err)
        }
    }

    function removeCourseInput() {
        inputCourses.length > 2
        ? setInputCourses(inputCourses.slice(0, inputCourses.length - 1))
        : setErrorMessage("No less than 2 courses are allowed per group")
    }

    function addCourseInput() {
        inputCourses.length < 10
        ? setInputCourses([...inputCourses, inputCourses[inputCourses.length-1]+1])
        : setErrorMessage("No more than 10 courses are allowed per group")
    }

    return (
        <div className="flex justify-center">
            <form className="flex flex-col m-5 text-md p-6 text-white lg:w-192" onSubmit={(e) => handleSubmit(e)}>
                <div className="text-center text-3xl sm:text-4xl mb-5 text-green-400 font-extrabold">Create A New Group</div>
                <label htmlFor="group-name">Group Name</label>
                <input className="m-2 border-2 border-green-400 p-2 text-black" id="group-name" name="group-name" type="text"/>
                {inputCourses.map(courseNum => (
                    <>
                        <label htmlFor={`course-${courseNum}`}>URL of Course {courseNum}</label>
                        <input className="m-2 border-2 border-green-400 p-2 text-black" id={`course-${courseNum}`} type="text" required /> 
                    </>
                ))}
                <input className="px-3 py-1 my-6 ml-auto mr-auto text-gray-900 w-32 bg-green-400 text-xl font-extrabold rounded-xl" type="submit" value="Submit" />

                <div className="flex flex-col sm:flex-row sm:justify-center items-center">
                    <button onClick={addCourseInput} className="text-xl border-2 border-green-400 p-1 w-52 rounded-xl m-2 text-green-400" >
                        Add Course
                    </button>
                    <button onClick={removeCourseInput} className="text-xl border-2 border-green-400 p-1 w-52 rounded-xl m-2 text-green-400" >
                        Remove Course
                    </button>
                </div>
                {errorMessage === "Success" ? <Redirect to={"/g/" + groupURL} />: <ValidationError message={errorMessage}/>}
            </form>

            <LoadingModal isOpen={isOpen}/>
        </div>
    )
}

export default CourseForm
import { ReactTinyLink } from 'react-tiny-link'
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { useState } from 'react';

function Groups() {

    const groups = useSelector(store => store.groupsReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch("/groups")
        .then(res => res.json())
        .then(data => {
            dispatch({type: "SET-GROUPS", payload: data})
        })
        .catch(err => console.log(err))
    }, [])

    function getFirstFourCourses(group) {
        return group.courses.slice(0, 4)
    }

    return (
        <section class="text-gray-400 bg-gray-900 body-font">
            <div class="container px-5 py-24 mx-auto">
                <div class="flex flex-wrap -m-4 justify-items-center items-center">
                    {groups.map(group => (
                        <div class="p-4 w-full h-full lg:w-1/2 xl:w-1/3">
                            <div class="h-full bg-gray-800 bg-opacity-40 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                                <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">Course Bundle</h2>
                                <h1 class="title-font sm:text-2xl text-xl font-medium text-white mb-3">{group.groupName}</h1>
                                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                                    {/* Only display images of the first four courses */}
                                    {getFirstFourCourses(group).map(course => (
                                        <img className="w-full" src={course.ogImage} alt="" />
                                    ))}
                                </div>
                                <Link to={"/g/" + group.routeId} class="text-green-400 inline-flex items-center mt-3">See Courses
                                    <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Groups
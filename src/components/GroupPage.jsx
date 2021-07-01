import { useEffect, useState, useLayoutEffect } from "react";
import Navbar from './Navbar'
import CommentsModal from "./CommentsModal";
import { useDispatch, useSelector } from 'react-redux'
import defaultCourseImage from '../assets/defaultCourseImage.png'

function GroupPage({ match }) {

    const groupId = match.params.groupId
    const group = useSelector(store => store.groupReducer)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selectedCourseIdx, setSelectedCourseIdx] = useState(0)
    const dispatch = useDispatch();
    const [heartColors, setHeartColors] = useState([])
    const [toggledLikes, setToggledLikes] = useState([])

    useEffect(() => {
        fetch("/g/" + groupId)
        .then(res => res.json())
        .then(data => dispatch({type: "SET-GROUP", payload: data[0]}))
        .catch(err => alert(err))
    }, [groupId, dispatch])

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => setIsLoggedIn(data.isLoggedIn))
        .catch(err => alert(err))
        // modal doesn't close when going to a new route and coming back
        // so it needs to be closed upon mounting of the component
        dispatch({type:"CLOSE-COMMENT-MODAL"})
    }, [dispatch])
    
    useLayoutEffect(() => {
        fetch("/setHeartColors", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({groupId: groupId})
        }, [groupId])
        .then(res => res.json())
        .then(colors => {
            setHeartColors(colors)
            // initialize toggled likes array to the right size
            setToggledLikes(new Array(colors.length).fill(0))
        })
        .catch(err => alert(err))
        
    }, [dispatch, groupId])

    async function updateLikes(groupName, course, courseIdx) {
        toggleLike(courseIdx);

        fetch("/updateLikes", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "x-access-token": localStorage.getItem("token")
            }, 
            body: JSON.stringify({groupName: groupName, course: course})
        })
        .catch(err => alert(err))
    }

    function openModal(courseIdx) {
        setSelectedCourseIdx(courseIdx)
        dispatch({type: "OPEN-COMMENT-MODAL"})
    }

    function toggleLike(courseIdx) {
        console.log(toggledLikes)
        const newHeartColors = [...heartColors];
        const newToggledLikes = [...toggledLikes]
        if (newHeartColors[courseIdx] === "red") {
            newHeartColors[courseIdx] = "none"
            newToggledLikes[courseIdx] -= 1
        } else {
            newHeartColors[courseIdx] = "red"
            newToggledLikes[courseIdx] += 1
        }
        setHeartColors(newHeartColors)
        setToggledLikes(newToggledLikes)
    }


    return (
        <div className="text-white bg-gray-900">
            <Navbar/>
            {
                group.groupName
                ? <CommentsModal courseIdx={selectedCourseIdx} groupName={group.groupName}/>
                : <div></div>
            }
            {group
            ? <>
                <div className="text-3xl font-extrabold p-8 text-center">{group.groupName}</div>
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 py-2 mx-4 place-items-center">
                    {group.courses
                        ? group.courses.map((course, index) => (
                            <div key={course._id} className="rounded-xl p-5 flex flex-col items-center bg-gray-800 bg-opacity-40">
                                <a href={course.url} target="_blank" rel="noreferrer" className="hover:underline font-bold text-2xl mb-2 text-center">{course.ogTitle}</a>
                                <p className="text-gray-400 mb-4 text-md">{course.ogSiteName}</p>
                                <img className="w-auto max-h-48 object-cover mb-4" src={course.ogImage || defaultCourseImage} alt="" />
                                <div className="mb-2 text-lg text-center">{course.ogDesc}</div>
                                {isLoggedIn
                                ? <svg onClick={() => updateLikes(group.groupName, course, index)} xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 cursor-pointer" fill={heartColors[index]} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                : null
                                }
                                <div className="mx-3 my-2">{course.likeCount + (toggledLikes[index] || 0)}</div>
                                <button onClick={() => openModal(index)} className="text-green-400 mb-2 p-2 border-2 rounded-md border-green-400 font-bold">See Comments</button>
                                <div className="flex flex-row items-center m-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <h3 className="ml-2">{course.comments.length}</h3>
                                </div>
                            </div>
                        ))
                        : <div>Loading...</div>
                    }
                </div>
                </>
            : <div className="text-3xl text-center py-5">Group Not Found</div>}
        </div>
    )
}

export default GroupPage;
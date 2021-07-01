import { useLayoutEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

function CommentsModal({courseIdx, groupName}) {

    const group = useSelector(store => store.groupReducer)
    const course = group.courses[courseIdx]

    const [errorMessage, setErrorMessage] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const isCommentsModalOpen = useSelector(store => store.modalReducer).commentModal
    const dispatch = useDispatch();

    async function addComment(e) {
        try {
            e.preventDefault();
            const commentText = e.target[0].value
            e.target[0].value = ""

            const res = await fetch("/addComment", {
                method: "POST",
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-type": "application/json"
                },
                body: JSON.stringify({text: commentText, groupName: groupName, courseURL: course.url})
            })
            const data = await res.json()
            setErrorMessage(data.message)
            if (!data.message) dispatch({type: "SET-GROUP", payload: data})
        } catch (err) {
            setErrorMessage(err)
        }
    }

    useLayoutEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
        })
        .then(res => res.json())
        .then(data => setIsLoggedIn(data.isLoggedIn))
        .catch(err => setErrorMessage(err))
    }, [])

    function closeModal() {
        dispatch({type: "CLOSE-COMMENT-MODAL"})
        setErrorMessage("")
    }

    return (
        <div className="flex justify-center items-center">
            <div className={`${isCommentsModalOpen ? "flex": "hidden"} bg-gray-900 z-40 opacity-90 inset-0 fixed`}></div>
            <div className={`px-4 ${isCommentsModalOpen ? "flex": "hidden"} items-center top-3 sm:top-5 lg:top-72 flex-col fixed w-11/12 h-5/6 lg:h-192 z-50  md:w-192 md:h-auto bg-white text-black`}>
                <button className="ml-auto pt-4" onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold">Comments</h1>

                {course
                    ? <h1>{course.ogTitle}</h1>
                    : <div>Select a course...</div>
                }

                <div className="overflow-y-scroll break-all h-96 mr-auto ml-auto">
                    {course
                        ? course.comments.map(comment => (
                            <div key={comment.id} className="bg-gray-200 border-black mx-2 my-4 flex flex-row items-center">
                                <img className="w-10 h-10 mx-2" src={comment.authorPfp} alt="" />
                                <div className="flex flex-col p-2">
                                    <Link to={"/u/" + comment.author} className="font-bold hover:underline hover:text-blue-500">{comment.author}</Link>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))
                        : <div></div>
                    }
                </div>

                {isLoggedIn
                    ? <form onSubmit={(e) => addComment(e)} className="m-2">
                        <input className="sm:w-auto w-36 border-2 border-green-400 m-2 p-1 rounded-md" type="text" required />
                        <input className="border-green-400 border-2 font-bold text-xl bg-transparent px-2 py-1 text-green-400 rounded-xl" type="submit" value="Add" />
                    </form>
                    : null 
                }

                <div className="text-red-500 font-bold my-1 sm:my-4">{errorMessage}</div>
            </div>
        </div>
    )
}

export default CommentsModal;
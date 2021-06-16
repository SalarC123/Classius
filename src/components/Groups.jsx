import { ReactTinyLink } from 'react-tiny-link'
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

function Groups() {

    const filteredGroups = useSelector(store => store.filteredGroupsReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch("/courses")
        .then(res => res.json())
        .then(data => {
            dispatch({type: "SET-GROUPS", payload: data})
            dispatch({type: "FILTER-GROUPS", payload: data})
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <section class="text-gray-400 bg-gray-900 body-font">
            <div class="container px-5 py-24 mx-auto">
                <div class="flex flex-wrap -m-4 justify-items-center">
                    {filteredGroups.map(group => (
                        <Link to={"/g/" + group.routeId}>
                            <div class="p-4 lg:w-full">
                                <div class="h-full bg-gray-800 bg-opacity-40 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                                    <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">Course Bundle</h2>
                                    <h1 class="title-font sm:text-2xl text-xl font-medium text-white mb-3">{group.groupName}</h1>
                                    {group.courses.map(course => (
                                        // do open graph stuff here
                                        <ReactTinyLink
                                            cardSize="small"
                                            showGraphic={true}
                                            maxLine={2}
                                            minLine={1}
                                            url={course.url || "https://en.wikipedia.org/wiki/HTTP_404"}
                                        />
                                    ))}
                                    <a class="text-green-400 inline-flex items-center">Learn More
                                        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h14"></path>
                                        <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
        // <div>
        //     {filteredGroups.map((group) => {
        //         return (
        //             <div className="hover:bg-yellow-50 cursor-pointer border-yellow-400 border-4 m-4">
        //                 <Link to={"/g/" + group.routeId}>
        //                     <h1 className="font-extrabold text-3xl text-center m-4 text-yellow-400">{group.groupName}</h1>
        //                     {group.courses.map(course => {
        //                         // do open graph stuff here
        //                         return (
        //                             <ReactTinyLink
        //                                 cardSize="small"
        //                                 showGraphic={true}
        //                                 maxLine={2}
        //                                 minLine={1}
        //                                 url={course.url || "https://en.wikipedia.org/wiki/HTTP_404"}
        //                             />
        //                         )
        //                     })}
        //                 </Link>
        //             </div>
        //         )
        //     })}
        // </div>
    )
}

export default Groups
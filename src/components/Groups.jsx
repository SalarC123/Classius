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
        <div>
            {filteredGroups.map((group) => {
                return (
                    <div className="hover:bg-yellow-50 cursor-pointer border-yellow-400 border-4 m-4">
                        <Link to={"/g/" + group.routeId}>
                            <h1 className="font-extrabold text-3xl text-center m-4 text-yellow-400">{group.groupName}</h1>
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
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Groups
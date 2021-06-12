import {  useSelector, useDispatch } from 'react-redux'

function GroupSearch() {

    const groups = useSelector(store => store.groupsReducer)
    const dispatch = useDispatch()

    function search(searchTerm) {
        dispatch({type: "FILTER-GROUPS", payload: groups.filter(item => item.groupName.toLowerCase().includes(searchTerm))})
    }

    return (
        <div>
            <label>Search</label>
            <input className="border-2 border-yellow-300 p-2 m-2" type="text" onKeyDown={e => e.which === 13 ? search(e.target.value) : null }/>
            <svg 
                /* grabs value of previous element on click */
                onClick={(e) => search(e.target.parentElement.children[1].value)} 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 inline-block" fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    )
}

export default GroupSearch;
import {  useDispatch } from 'react-redux'

function GroupSearch() {

    const dispatch = useDispatch()

    async function search(searchTerm) {
        try {
            const res = await fetch("/searchfilter", {
                method:"POST",
                headers: {
                    "Content-type":"application/json",
                },
                body: JSON.stringify({searchTerm: searchTerm})
            })
            const data = await res.json()
            dispatch({type: "SET-GROUPS", payload: data})
        } catch (err) {
            alert(err)
        }
    }

    return (
        <div className="text-white m-8 flex flex-row items-center justify-center">
            <input placeholder="Search all groups" className="border-2 lg:w-96 sm:w-72 w-40 border-green-400 p-2 m-2 text-black" type="text" onKeyDown={e => e.which === 13 ? search(e.target.value) : null }/>
            <svg 
                /* grabs value of previous element on click */
                onClick={(e) => search(e.target.parentElement.children[1].value)} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                className="w-8 h-8 inline-block"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    )
}

export default GroupSearch;
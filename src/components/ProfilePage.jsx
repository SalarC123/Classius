import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function ProfilePage({ match }) {
    const userId = match.params.userId;
    const [user, setUser] = useState({})

    useEffect(() => {
        fetch("/api/u/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser(data)
        })
        .catch(err => alert(err)) 
    }, [userId])
    
    async function changeUserInfo(e) {
        e.preventDefault();
        const form = e.target
        const newBio = form[0].value;

        setUser({...user, bio: newBio})
        form[0].value = ""

        try {
            await fetch("/api/updateUserInfo", {
                method: "POST",
                headers: {
                    "x-access-token": localStorage.getItem("token"),
                    "Content-type": "application/json"
                },
                body: JSON.stringify({newBio: newBio})
            })
        } catch (err) {
            alert(err)
        }
    }
    
    return (
        <div className="">
            <Navbar/>
            <div className="bg-gray-900 text-white">
                <header className="flex flex-row justify-center p-5">
                    {user.username !== "User Not Found" ? <img className="h-20 w-20" src={user.pfp} alt="" />: null}
                    <h1 className="text-3xl py-5 px-3">{user.username}</h1>
                </header>
                {user.username === "User Not Found" 
                ? null
                : <>
                    <h1 className="text-center text-3xl px-10 font-bold sm:text-4xl underline">Biography</h1>
                    <div className="w-5/6 md:w-192 ml-auto mr-auto text-xl py-5 break-words mb-10">{user.bio}</div>
                    <h1 className="text-center text-3xl px-10 mb-10 font-bold sm:text-4xl underline">Created Groups</h1>
                    <div className="break-words grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-4 m-4">
                        {user.createdGroups
                        ? user.createdGroups.map(group => (
                            <Link key={group._id} className="bg-gray-800 bg-opacity-40 rounded p-5 hover:opacity-50" to={group.url}>{group.groupName}</Link>
                        ))
                        : <div className="w-screen h-screen z-10 bg-gray-900 text-center text-4xl">Loading...</div>}
                    </div>
                  </>
                }

                {user.canEdit 
                ? <form onSubmit={(e) => changeUserInfo(e)} className="flex flex-col mx-8 items-center">
                      <label className="text-2xl font-extrabold py-2" htmlFor="bio">Change Bio</label>
                      <textarea className="text-black p-1 sm:w-96 w-72 lg:w-192 h-72" maxLength="1000" name="bio" id="bio" />
                      {/* <label htmlFor="pfp"></label>
                      <input type="file" id="pfp" name="pfp" accept="image/*"/api/> */}
                      <input className="m-1 px-2 py-1 rounded font-bold text-xl w-52 bg-green-400 text-gray-900" type="submit" value="Submit" />
                      <p className="text-sm my-1">1000 characters maximum</p>
                  </form>
                : <></>
                }
            </div>
        </div>
    )
}

export default ProfilePage
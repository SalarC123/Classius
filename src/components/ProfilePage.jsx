import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Navbar from './Navbar'

function ProfilePage({ match }) {
    const userId = match.params.userId;
    const [user, setUser] = useState({})

    useEffect(() => {
        fetch("/u/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser(data)
        })
    }, [userId])

    async function changeUserInfo(e) {
        e.preventDefault();
        const form = e.target
        const newBio = form[0].value;

        await fetch("/updateUserInfo", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({newBio: newBio})
        })
    }
    
    return (
        <div className="min-h-screen">
            <Navbar/>
            <div className="bg-gray-900 text-white">
                <header className="flex flex-row justify-center p-5">
                    {user.username !== "User Not Found" ? <img className="h-20 w-20" src={user.pfp} alt="" />: null}
                    <h1 className="text-3xl py-5 px-3">{user.username}</h1>
                </header>
                {user.username == "User Not Found" 
                ? null
                : <>
                    <h1 className="text-4xl px-10 font-bold">Bio</h1>
                    <div className="text-xl px-16 py-5 break-words">{user.bio}</div>
                    <h1 className="text-4xl px-10 font-bold">Created Groups</h1>
                    <div className="grid grid-cols-2 grid-rows-2 gap-4">
                        {user.createdGroups
                        ? user.createdGroups.map(group => (
                            <Link className="mx-8 my-4 border-4 border-white rounded p-3 hover:opacity-70" to={group.url}>{group.groupName}</Link>
                        ))
                        : <div>Loading...</div>}
                    </div>
                  </>
                }

                {user.canEdit 
                ? <form onSubmit={(e) => changeUserInfo(e)} className="flex flex-col mx-8 items-center">
                      <label className="text-2xl font-extrabold py-2" htmlFor="bio">Change Bio</label>
                      <textarea className="text-black p-1 w-96 h-72" maxLength="1000" name="bio" id="bio" />
                      {/* <label htmlFor="pfp"></label>
                      <input type="file" id="pfp" name="pfp" accept="image/*"/> */}
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
import { useEffect, useState } from "react";
import Navbar from './Navbar'

function ProfilePage({ match }) {
    const userId = match.params.userId;
    const [username, setUsername] = useState("")
    const [canEdit, setCanEdit] = useState(false)
    const [pfp, setPfp] = useState("")
    const [bio, setBio] = useState("")

    useEffect(() => {
        fetch("/u/" + userId, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => {
            setUsername(data.username)
            setCanEdit(data.canEdit)
            setPfp(data.pfp)
            setBio(data.bio)
        })
    }, [])

    async function changeUserInfo(e) {
        e.preventDefault();
        const form = e.target
        const newBio = form[0].value;

        const res = await fetch("/updateUserInfo", {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify({newBio: newBio})
        })
    }
    
    return (
        <div className="h-screen">
            <Navbar/>
            <div className="bg-gray-900 text-white">
                <header className="flex flex-row justify-center p-5">
                    {username != "User Not Found" ? <img className="h-20 w-20" src={pfp} alt="" />: null}
                    <h1 className="text-3xl py-5 px-3">{username}</h1>
                </header>
                {username != "User Not Found" 
                ? <>
                    <h1 className="text-4xl px-10 font-bold">Bio</h1>
                    <div className="text-xl px-16 py-5 break-words">{bio}</div>
                </>
                : null
                }
                {
                    canEdit ? 
                    <form onSubmit={(e) => changeUserInfo(e)} className="flex flex-col mx-8 items-center">
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
import Navbar from "./Navbar"

function FAQ() {

    function sendFeedback(e) {
        e.preventDefault()
        const form = e.target
        const feedback = form[0].value;
        e.target[0].value = "";

        fetch("/api/sendFeedback", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({feedback: feedback})
        })
        .catch(err => alert(err))
    }

    return (
        <div className="text-white">
            <Navbar/>
            <main className="flex flex-col m-5">
                <section className="pl-4 border-l-4 border-green-400 mb-10">
                    <h1 className="text-3xl font-bold">What Problem Does Classius Solve?</h1>
                    <p className="pl-10 m-2 text-lg">
                        Unfortunately, the internet's biggest strength is its biggest weakness.
                        It has too many options. You've probably found yourself in situations
                        where you want to learn new skills so that you can switch jobs or get
                        a leg up in your current one, but you have an abundance of courses to
                        choose from, and every website you check has a widely different opinion 
                        about which one is the best. Thus, I made Classius to be an all-in-one
                        course reviewing website that lets you view and create groups made of
                        courses from whatever subject you would like to study.  Using Classius,
                        you can view which courses are most favored by the community without 
                        scouring all over the internet, and if you don't see any groups that
                        compare the courses you're deciding between, you can create your own
                        group and share it around.
                    </p>
                </section>   
                <section className="pl-4 border-l-4 border-green-400 mb-10">
                    <h1 className="text-3xl font-bold">I found a bug. Who do I tell?</h1>
                    <p className="pl-10 m-2 text-lg">
                        If you find a bug, please go to<a href="https://github.com/salarc123/classius">Classius's github page </a> 
                        and describe the problem in the issues tab, and if you would like to make any 
                        direct changes, you can also make a pull request because this project is currently
                        open sourced. If you would like to leave any other feedback or send any questions to be 
                        answered on this page, you can leave it in the feedback form below
                    </p>
                </section>   


                <form onSubmit={(e) => sendFeedback(e)} className="flex flex-col mx-8 items-center">
                    <label className="text-2xl font-extrabold py-2" htmlFor="bio">Feeback</label>
                    <textarea className="text-black p-1 sm:w-96 w-72 lg:w-192 h-72" maxLength="2000" name="bio" id="bio" />
                    <input className="m-1 px-2 py-1 rounded font-bold text-xl w-52 bg-green-400 text-gray-900" type="submit" value="Submit" />
                    <p className="text-sm my-1">2000 characters maximum</p>
                </form>
            </main>  
        </div>
    )
}

export default FAQ
import Navbar from "./Navbar"

function FAQ() {

    return (
        <div className="text-white">
            <Navbar/>
            <main className="flex flex-col m-5">
                <section className="pl-4 border-l-4 border-green-400 mb-10">
                    <div className="text-3xl font-bold">What Problem Does Classius Solve?</div>
                    <div className="pl-10 m-2 text-lg">Answer</div>
                </section>   
                <section className="pl-4 border-l-4 border-green-400 mb-10">
                    <div className="text-3xl font-bold">I found a bug, so who do I tell?</div>
                    <div className="pl-10 m-2 text-lg">Answer</div>
                </section>   
            </main>  
        </div>
    )
}

export default FAQ
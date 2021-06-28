import bars from '../assets/bars.svg'

function LoadingModal({isOpen}) {

    return (
        <div className={`${isOpen ? "flex": "hidden"} flex-col border-8 border-green-400 justify-center items-center fixed top-1/2 left-1/2 -mx-32 -my-32 w-64 h-64 rounded bg-white`}>
            <img src={bars} alt="Loading Bars" />
            <h1 className="text-2xl m-4 font-extrabold text-green-400">Creating Group...</h1>
        </div>
    )
}

export default LoadingModal
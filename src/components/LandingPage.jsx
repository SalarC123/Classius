import landingTutorial from '../assets/landingTutorial.svg'
import landingConfused from '../assets/landingConfused.svg'
import landingPath from '../assets/landingPath.svg'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function LandingPage() {

    useEffect(() => {
        fetch("/api/groups")
        .then(res => res.json())
        .then(data => console.log(data, "Absolute Path"))
        .catch(err => console.log(err, "Absolute Path"))
    })

    useEffect(() => {
        fetch("https://classius.herokuapp.com/groups")
        .then(res => res.json())
        .then(data => console.log(data, "Relative Path"))
        .catch(err => console.log(err, "Relative Path"))
    })

    return (
        <div>
            <Navbar/>
            <div className="mb-10 h-2 bg-gradient-to-r from-green-400 via-blue-400 to-pink-400"></div>
            <section className="flex flex-col md:flex-row items-center justify-center text-white">
                <div className="flex flex-col max-w-2xl items-center md:items-start px-8">
                    <h1 className="title-font md:text-left text-center text-4xl sm:text-6xl xl:text-7xl pb-4 font-extrabold text-white">Find The <div className="inline-block text-green-400">Best</div> Online Courses.</h1>
                    <p className="text-lg md:text-xl xl:text-2xl md:text-left text-center leading-relaxed">Explore the community's top rated courses for whatever subject you want to study or skill you want to learn</p>
                    <Link to="/dashboard" className="bg-gray-800 w-48 inline-flex py-3 px-5 rounded-lg items-center md:mb-14 mt-5 hover:bg-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="ml-4 text-gray-400 flex items-start flex-col leading-none">
                            <span className="text-xs mb-1">Discover</span>
                            <span className="title-font text-white font-medium">Courses</span>
                        </span>
                    </Link>
                </div>
                <div>
                    <img className="px-2" alt="hero" src={landingTutorial}/>
                </div>
            </section>
            <section className="bg-white pt-8 pb-8 flex flex-col text-gray-900 md:flex-row items-center justify-center">
                <div>
                    <img className="px-2" alt="hero" src={landingConfused}/>
                </div>
                <div className="flex flex-col max-w-2xl items-center md:items-end px-8">
                    <h1 className="py-8 title-font md:text-right text-center text-3xl sm:text-6xl xl:text-7xl pb-4 font-extrabold text-gray-900">Can't Make A <div className="inline-block text-blue-400">Decision</div>?</h1>
                    <p className="pb-8 text-xl md:text-right text-center leading-relaxed">We've got you covered! Classius gives users the ability to leave comments describing why they chose a certain course </p>
                    <Link to="/register" className="border-gray-900 border-4 w-48 inline-flex py-3 px-5 rounded-lg items-center hover:bg-gray-200 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="ml-4 text-gray-400 flex items-start flex-col leading-none">
                            <span className="text-xs mb-1 text-gray-700">Create An</span>
                            <span className="title-font text-gray-900 font-medium">Account</span>
                        </span>
                    </Link>    
                </div>
            </section>
            <section className="pt-8 flex flex-col md:flex-row items-center justify-center text-white">
                <div className="flex flex-col max-w-2xl items-center md:items-start px-8">
                    <h1 className="py-8 title-font md:text-left text-center text-3xl sm:text-6xl xl:text-7xl pb-4 font-extrabold text-white">Help Beginners Find The <div className="inline-block text-pink-400">Right</div> Path.</h1>
                    <p className="text-xl md:text-left text-center leading-relaxed">Discuss and share knowledge about courses you loved to take in order to benefit the community</p>
                    <Link to="/login" className="bg-gray-800 w-48 inline-flex py-3 px-5 rounded-lg items-center mt-5 md:mb-8 hover:bg-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="ml-4 text-gray-400 flex items-start flex-col leading-none">
                            <span className="text-xs mb-1">Connect With The</span>
                            <span className="title-font text-white font-medium">Community</span>
                        </span>
                    </Link>                    
                </div>
                <div>
                    <img className="px-2" alt="hero" src={landingPath}/>
                </div>
            </section>
        </div>
    )
}   

export default LandingPage
import placeholder_img from "@/assets/logo_placeholder.jpg";
import {NavLink} from "react-router-dom";

const Hero = () => {
    return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
            <div>
                <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">Check your skills with <span className="text-blue-600">CSSAT</span></h1>
                <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">Select your self-assessment path.</p>

                {/* Buttons */}
                <div className="mt-7 grid gap-3 w-full sm:inline-flex">
                    <NavLink to={"/start"}
                         className={`py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none`}>
                        Get started
                        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </NavLink>
                </div>
                {/* End Buttons */}
            </div>
            {/* End Col */}

            <div className="relative ms-4">
                <img className="w-full rounded-md" src={placeholder_img} alt="Hero Image" />
            </div>
            {/* End Col */}
        </div>
        {/* End Grid */}
    </div>
    );
};

export default Hero;

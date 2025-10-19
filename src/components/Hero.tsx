import {NavLink} from "react-router-dom";
import {AnimatedTooltip} from "@/components/Team.tsx";

import simonas from "@/assets/Team/simonas.jpg";
import tomas from "@/assets/Team/tomas.png";
import einis from "@/assets/Team/einis.png";
import kaspar from "@/assets/Team/kaspar.jpg";
import kaupo from "@/assets/Team/kaupo.png";
import marken from "@/assets/Team/marken.png";

const Hero = () => {
    const people = [
        {
            id: 1,
            name: "Simonas Radžius",
            designation: "",
            image:
                `${simonas}`,
        },
        {
            id: 2,
            name: "Tomas Krulikauskas",
            designation: "",
            image:
                `${tomas}`,
        },
        {
            id: 3,
            name: "Einis Šatrauskas",
            designation: "",
            image:
                `${einis}`,
        },
        {
            id: 4,
            name: "Kaspar Bergert",
            designation: "",
            image:
                `${kaspar}`,
        },
        {
            id: 5,
            name: "Kaupo Sohkin",
            designation: "",
            image:
                `${kaupo}`,
        },
        {
            id: 6,
            name: "Marken Mangelsoo",
            designation: "",
            image:
                `${marken}`,
        },
    ];

    return (
        <div className="flex flex-col justify-between items-center min-h-screen px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Main content */}
            <div className="flex flex-col justify-center items-center flex-grow text-center">
                <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
                    Check your skills with <span className="text-blue-600">CSSAT</span>
                </h1>

                <p className="mt-3 text-lg text-gray-800 dark:text-neutral-400">
                    Select your self-assessment path.
                </p>

                {/* Buttons */}
                <div className="mt-7 flex justify-center">
                    <NavLink
                        to={"/start"}
                        className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Get started
                        <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </NavLink>
                </div>
            </div>

            {/* Tooltip row */}
            <div className="flex-row items-center justify-center w-full mb-20 hidden md:flex">
                <AnimatedTooltip items={people} size={100} />
            </div>
        </div>
    );
};

export default Hero;

import {NavLink} from "react-router-dom";
import networking_img from "@/assets/Networking.jpg";
import software_img from "@/assets/Software.jpg";
import cyber_security_img from "@/assets/Cyber_security.jpg";

const Selection = () => {
    return (
        <div className=" min-h-screen">
            <div className="flex justify-center w-full py-5">
                <h1 className="text-5xl font-bold text-white">Select one of the options</h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 px-4 py-5">
                <NavLink
                    to="/start"
                    className="w-full lg:flex-1 relative flex justify-center items-center text-center text-2xl font-bold rounded-lg border border-transparent text-white hover:bg-opacity-90 focus:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[25vh] lg:min-h-[70vh] overflow-hidden"
                    style={{ backgroundImage: `url(${networking_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                            <span className="relative z-10 bg-black/70 px-4 py-2 rounded max-w-[70%]">
                                Network security
                            </span>
                </NavLink>

                <NavLink
                    to="/start"
                    className="w-full lg:flex-1 relative flex justify-center items-center text-center text-2xl font-bold rounded-lg border border-transparent text-white hover:bg-opacity-90 focus:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[25vh] lg:min-h-[70vh] overflow-hidden"
                    style={{ backgroundImage: `url(${software_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                            <span className="relative z-10 bg-black/70 px-4 py-2 rounded max-w-[70%]">
                                Secure software development
                            </span>
                </NavLink>

                <NavLink
                    to="/start"
                    className="w-full lg:flex-1 relative flex justify-center items-center text-center text-2xl font-bold rounded-lg border border-transparent text-white hover:bg-opacity-90 focus:outline-none disabled:opacity-50 disabled:pointer-events-none min-h-[25vh] lg:min-h-[70vh] overflow-hidden"
                    style={{ backgroundImage: `url(${cyber_security_img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                >
                            <span className="relative z-10 bg-black/70 px-4 py-2 rounded max-w-[70%]">
                                Cyber hygiene
                            </span>
                </NavLink>
            </div>
        </div>
    );
};

export default Selection;

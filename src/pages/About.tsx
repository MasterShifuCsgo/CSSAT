import Navbar from "@/components/Navbar.tsx";


const About = () => {
    return (
        <div>
            <Navbar/>

            <div className="flex justify-center w-full">
                <h1 className={`text-5xl font-bold text-white`}>About</h1>
            </div>
        </div>
    );
};

export default About;

import Sidebar from "@/components/Sidebar.tsx";
import Selection from "@/components/Selection.tsx";

const Start = () => {
    return (
        <div>
            <Sidebar/>

            <div className="text-white w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
                <Selection/>
            </div>
        </div>
    );
};

export default Start;
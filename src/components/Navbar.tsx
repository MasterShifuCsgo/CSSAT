import {NavLink} from "react-router-dom";

const navItems = [
    { name: "Main", link: "/" },
    // { name: "About", link: "/about" },
    // { name: "Contacts", link: "/contact" }
];

const Navbar = () => {
    return (
        <header className={`fixed flex w-full z-[100] top-0 left-0 px-[5%] py-5 bg-transparent justify-between items-center `}>
            <NavLink to='/' className={`text-3xl font-bold text-white`}>CSSAT</NavLink>
            <nav>
                {navItems.map((item, index) =>
                    <NavLink to={item.link}
                        key={index}
                        className={({ isActive }) => `relative text-white text-lg font-medium ml-10 before:absolute before:left-0 before:top-full before:h-[2px] before:bg-white before:transition-all before:duration-300 hover:before:w-full ${isActive ? 'before:w-full' : 'before:w-0'}`}>
                        {item.name}
                    </NavLink>)}
            </nav>
        </header>
    );
};

export default Navbar;
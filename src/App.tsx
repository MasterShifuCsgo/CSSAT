import {Routes, Route} from "react-router-dom";
import Home from "@/pages/Home.tsx";
import About from "@/pages/About.tsx";
import Contact from "@/pages/Contact.tsx";
import Start from "@/pages/Start.tsx";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

async function loadPreline() {
    return import('preline/dist/index.js');
}

function App() {
    const location = useLocation();

    useEffect(() => {
        const initPreline = async () => {
            await loadPreline();

            if (
                window.HSStaticMethods &&
                typeof window.HSStaticMethods.autoInit === 'function'
            ) {
                window.HSStaticMethods.autoInit();
            }
        };

        initPreline();
    }, [location.pathname]);

    return (
        <>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path='/start' element={<Start/>}/>
            </Routes>
        </>
    )
}

export default App

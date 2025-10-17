import {Routes, Route} from "react-router-dom";
import Home from "@/pages/Home.tsx";
import About from "@/pages/About.tsx";
import Contact from "@/pages/Contact.tsx";
import Start from "@/pages/Start.tsx";

function App() {
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

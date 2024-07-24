import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, NavLink } from 'react-router-dom';
import { LoginContext } from './components/ContextProvider/Context';
import Register from './components/Register';
import Login from './components/Login';
import Error from './components/Error';
import CircularProgress from '@mui/material/CircularProgress';
import "bootstrap/dist/css/bootstrap.css";
import "remixicon/fonts/remixicon.css";
import Box from '@mui/material/Box';
// import Header from './components/Header';
import Homepage from './Home/Homepage';
import Aboutpage from './About/Aboutpage';
import Uploadpage from './Uploads/Uploadpage';
import Features from './components/features-secton/Features';
import Uploadpdf from './Uploads/Uploadpdf';
import UploadList from './Uploads/UploadList';
import Anlayzepage from './Uploads/Anlayzepage';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const { setLoginData } = useContext(LoginContext);
    const history = useNavigate();

    // Simulated authentication check
    const checkAuthentication = async () => {
        // Simulated delay for loading state
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    };

    // Simulated authentication check on component mount
    useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    Loading... &nbsp;
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Error />} />
                        <Route path="/home" element={<Homepage/>}/>
                        <Route path="/about" element={<Aboutpage/>}/>
                        <Route path="/features" element={<Features/>}/>
                        <Route path="/uploads" element={<Uploadpdf/>}/>
                        <Route path="/uploadvd" element={<Uploadpage/>}/>
                        <Route path = "/analyze" element = {<Anlayzepage/>}/>
                    </Routes>
                </>
            )}
        </>
    );
}

export default App;

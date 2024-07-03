import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import './header.css';

const navLinks = [
    {
        display: 'Home',
        url: '/home'
    },
    {
        display: 'Upload',
        url: '/uploadvd'
    },
    {
        display: 'Contact',
        url: '#'
    },
    {
        display: 'About Us',
        url: '/about'
    },
    {
        display: 'Features',
        url: '/features'
    }
];

const Header = () => {
    const menuRef = useRef();
    const navigate = useNavigate();

    const menuToggle = () => menuRef.current.classList.toggle('active_menu');

    const handleLogout = () => {
        // Implement logout functionality
        console.log("User logged out");
        // Add your logout logic here, e.g., clearing tokens, etc.

        // Redirect to the login page
        navigate('/');
    };

    return (
        <header className="header">
            <Container>
                <div className='navigation d-flex align-items-center justify-content-between'>
                    <div className='logo'>
                        <h2 className="d-flex align-items-center">
                            <i className="ri-pantone-fill"></i> Dune State University
                        </h2>
                    </div>

                    <div className="nav d-flex align-items-center gap-5">
                        <div className="nav_menu" ref={menuRef}>
                            <ul className="nav_list">
                                {navLinks.map((item, index) => (
                                    <li className="nav_item" key={index}>
                                        <a href={item.url}>{item.display}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="nav_right d-flex align-items-center gap-3">
                            {/* <p className="mb-0 d-flex align-items-center gap-3">
                                <i className="ri-phone-fill"></i>040-963258
                            </p> */}
                            <Button color="danger" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>

                    <div className="mobile_menu">
                        <span><i className="ri-menu-line" onClick={menuToggle}></i></span>
                    </div>
                </div>
            </Container>
        </header>
    );
}

export default Header;

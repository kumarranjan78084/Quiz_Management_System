import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';

const Navbar1 = ({ user,userType, onLogout }) => {


    const [menuVisible, setMenuVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <div className="menu-icon" onClick={toggleMenu}>&#9776;</div>
            </div>

            {user ? (
                    <span className="user-greeting">{`Welcome, ${user}`}</span>
                ) : (
                    <></>
            )}

            <div className="navbar-center">
                <a href="#">Home</a>
                <a href="#topics">Topics</a>
                {user ? (
                    userType === 'student' ? (
                        <Link to="/:name/quiz_start">Start Quiz</Link>
                    ) : userType === 'faculty' ? (
                        <Link to="/:name/create-quiz">Create Quiz</Link>
                    ) : (
                        <></>
                    )
                ) : (
                    <></>
                )}
                <a href="#about">About</a>
            </div>

            <div className="navbar-right">
                <button id="mode-toggle" onClick={toggleMode}>
                    {darkMode ? '🌝' : '🌙'}
                </button>
                {user ? (
                    <>
                        <button className='logout' onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <Link className='login' to="/login">Login</Link>
                )}
            </div>

            {/* Sidebar */}
            <div id="menu" className={`menu ${menuVisible ? 'visible' : 'hidden'}`}>
                <a href="#home">Home</a>
                <a href="#topics">Topics</a>
                {user ? (
                    userType === 'student' ? (
                        <Link to="/:name/quiz_start">Start Quiz</Link>
                    ) : userType === 'faculty' ? (
                        <Link to="/:name/create-quiz">Create Quiz</Link>
                    ) : (
                        <></>
                    )
                ) : (
                    <></>
                )}
                <a href="#about">About</a>
                <hr />
                {user ? (
                    <button className='logout' onClick={onLogout}>Logout</button>
                ) : (
                    <Link to="/login" onClick={toggleMenu}>Login</Link>
                )}
            </div>

            {/* Overlay */}
            <div
                id="overlay"
                className={`overlay ${menuVisible ? 'visible' : 'hidden'}`}
                onClick={toggleMenu}
            ></div>
        </div>
    );
};

export default Navbar1;

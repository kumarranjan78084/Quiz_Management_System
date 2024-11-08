import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Quiz from './components/quiz';
import Quiz_Start from './components/quiz_start';

const App = () => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null);  
    const [userID, setUserID] = useState(null);

    const handleLogin = (user) => {
        setUser(user.name);
        setUserType(user.userType);
        setUserID(user.userID);  
    };

    const handleLogout = () => {
        if(window.confirm('You want to logout?')){
            setUser(null);
            setUserType(null);  
        }
    };

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/:name" element={user ? <Home user={user} userType={userType} onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route path="/:name/create-quiz" element={user ? <Quiz /> : <Navigate to="/" />} />
            <Route path="/:name/quiz_start" element={user ? <Quiz_Start userID={userID} /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={user ? `/${user}` : "/"} />} />
        </Routes>
    );
};

const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;

import React, { useState } from 'react';
import '../style/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
}

const Login = ({onLogin}) => {

    const [studentData, setStudentData] = useState({
        Name: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        password: '',
        confirmPassword: ''
    });

    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student');
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        phone: '',
    });

    const navigate = useNavigate();

    const handleSwitchUser = (type) => {
        setUserType(type);
        setCaptcha(generateCaptcha())
        setUserID('');
        setPassword('');
    };

    // Handle login logic
    const handleLogin = async () => {
        if (!captchaVerified) {
            alert('Please verify the captcha before logging in.');
            return;
        }

        try {
            const response = await fetch('http://localhost:4444/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userID,
                    password: password,
                    userType: userType
                })
            });
            if (!userID || !password) {
                alert("Please fill userID or password.");
                return;
            }            

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                alert('Login successful');
                onLogin({ name: data.name, userType , userID});
                if (userType === 'student') {
                    navigate(`/${data.name}`);
                } else if (userType === 'faculty') {
                    navigate(`/${data.name}`);
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('There was an error!', error);
            alert('An error occurred: ' + error.message);
        }
    };

    // Handle signup logic
    const handleSignup = async () => {
        const requiredFields = ['Name', 'email', 'phone', 'college', 'department', 'password', 'confirmPassword'];
        const missingField = requiredFields.find(field => !studentData[field]);

        if (missingField) {
            alert('All fields are required. Please fill in the ' + missingField + ' field.');
            return;
        }
        if (!captchaVerified) {
            alert('Please verify the captcha before proceeding.');
            return;
        }

        if (!/^[A-Z][a-zA-Z\s]*$/.test(studentData.Name)) {
            alert('Name must start with a capital letter and contain only alphabetic characters.');
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(studentData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!/^[1-9][0-9]{9}$/.test(studentData.phone)) {
            alert('Phone number must be exactly 10 digits and not start with 0.');
            return;
        }
    
        if (!studentData.college) {
            alert('Please select your college.');
            return;
        }
    
        if (!studentData.department) {
            alert('Please select your department.');
            return;
        }

        if (studentData.password.length < 8) {
            alert('Password must be exactly 8 characters long.');
            return;
        }

        if (studentData.password !== studentData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4444/signup', {
                ...studentData,
                userType: 'student'
            });

            if (response.data.success) {
                alert(`Keep this ID for Future Login! \n Signup successful! Your ID is: ${response.data.id}`);
                setIsLogin(true);
                setCaptchaInput('');
                setStudentData({
                    Name: '',
                    email: '',
                    phone: '',
                    college: '',
                    department: '',
                    password: '',
                    confirmPassword: ''
                });
            } else {
                alert('Signup failed: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup: ' + error.message);
        }
    };

    const handleCaptchaChange = (e) => {
        setCaptchaInput(e.target.value);
    };

    const handleCaptchaVerify = () => {
        if (captchaInput === captcha) {
            alert('Captcha verified successfully!');
            setCaptchaVerified(true);
        } else {
            alert('Captcha is incorrect. Please try again.');
            setCaptcha(generateCaptcha());
            setCaptchaInput('');
            setCaptchaVerified(false);
        }
    };

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setCaptchaVerified(false);
        setCaptchaInput('');
    };

    const toggleForms = () => {
        setIsLogin(!isLogin);
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
        setCaptchaVerified(false);
        setStudentData('');
    };

    const handleChange = (e, field) => {
        setStudentData({ ...studentData, [field]: e.target.value });

        if (field === 'email') {
            validateEmail(e.target.value);
        } else if (field === 'phone') {
            validatePhone(e.target.value);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|org|ac\.in)$/;
        if (!emailRegex.test(email)) {
            setErrors((prevErrors) => ({ ...prevErrors, email: 'Invalid email format. Only .gmail.com, .org, and .ac.in domains are allowed.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+\d{1,3})? ?\d{10}$/;
        if (!phoneRegex.test(phone)) {
            setErrors((prevErrors) => ({ ...prevErrors, phone: 'Invalid phone number format. Include country code and 10-digit phone number.' }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserID('');
        setPassword('');
        setUserType('');
        alert('Logged out successfully');
    };

    return (
        <div className="quiz-container">
            <i className="fa-solid fa-circle-xmark" onClick={() => navigate('/')}></i>
            <h1>Quiz Management System</h1>

            {isLogin ? (
                <div id="login-section">
                    <h2>Login {userType}</h2>
                    <div className="switch">
                        <button 
                            className={userType === 'student' ? 'active' : ''} 
                            onClick={() => handleSwitchUser('student')}>
                            Student
                        </button>
                        <button 
                            className={userType === 'faculty' ? 'active' : ''} 
                            onClick={() => handleSwitchUser('faculty')}>
                            Faculty
                        </button>
                    </div>
                    <div className="form-group">
                        <label htmlFor="userid">User ID:</label>
                        <input
                            type="text"
                            id="userID"
                            value={userID}
                            onChange={(e) => setUserID(e.target.value)}
                            placeholder="Enter User ID"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="captcha">Captcha:</label>
                        <div className="captcha-field">
                            <div className="captcha-image">{captcha}</div>
                            <i className="fa-solid fa-rotate" style={{ margin: '0 20px', cursor: 'pointer' }} onClick={refreshCaptcha}></i>
                            <input
                                type="text"
                                id="captcha"
                                placeholder="Enter Captcha"
                                value={captchaInput}
                                onChange={handleCaptchaChange}
                                style={{ margin: '0 20px', fontSize: '18px' }}
                            />
                            <button onClick={handleCaptchaVerify}>Verify Captcha</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <button onClick={handleLogin}>Login as {userType}</button>
                    </div>
                    {userType === 'student' && (
                        <div className="toggle-link" onClick={toggleForms}>
                            Don't have an account? Sign up here
                        </div>
                    )}
                </div>
            ) : (
                <div id="signup-section">
                    <h2>Sign Up as Student</h2>
                    <div id="student-signup">
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                value={studentData.Name}
                                onChange={(e) => handleChange(e, 'Name')}
                                placeholder="Enter your name"
                                required
                                pattern="^[A-Z][a-zA-Z\s]*$" // First letter must be capital, alphabetic characters only
                                title="Name must start with a capital letter and contain only alphabetic characters."
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={studentData.email}
                                onChange={(e) => handleChange(e, 'email')}
                                placeholder="Enter your email"
                                required
                                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Email format check
                                title="Please enter a valid email address."
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input
                                type="tel"
                                value={studentData.phone}
                                onChange={(e) => handleChange(e, 'phone')}
                                placeholder="Enter your phone number"
                                required
                                pattern="^[1-9][0-9]{9}$" // 10 digits, not starting with 0
                                title="Phone number must be exactly 10 digits and not start with 0."
                            />
                        </div>
                        <div className="form-group">
                            <label>College:</label>
                            <select
                                value={studentData.college}
                                onChange={(e) => handleChange(e, 'college')}
                                required
                            >
                                <option value="">Select College</option>
                                <option value="NIT Mizoram">NIT Mizoram</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Department:</label>
                            <select
                                value={studentData.department}
                                onChange={(e) => handleChange(e, 'department')}
                                required
                            >
                                <option value="">Select Department</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="ME">Mechanical Engineering</option>
                                <option value="EE">Electrical Engineering</option>
                                <option value="ECE">Electronic Communication Engineering</option>
                                <option value="CE">Civil Engineering</option>
                                <option value="IT">Information Technology</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={studentData.password}
                                onChange={(e) => handleChange(e, 'password')}
                                placeholder="Enter your password"
                                required
                                pattern="^[A-Za-z\d@$!%*?&]{8}$"  
                                title="Password must be exactly 8 characters long."
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input
                                type="password"
                                value={studentData.confirmPassword}
                                onChange={(e) => handleChange(e, 'confirmPassword')}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="captcha">Captcha:</label>
                            <div className="captcha-field">
                                <div className="captcha-image">{captcha}</div>
                                <i className="fa-solid fa-rotate" style={{ margin: '0 20px', cursor: 'pointer' }} onClick={refreshCaptcha}></i>
                                <input
                                    type="text"
                                    id="captcha"
                                    placeholder="Enter Captcha"
                                    value={captchaInput}
                                    onChange={handleCaptchaChange}
                                    style={{ margin: '0 20px', fontSize: '18px' }}
                                    required
                                />
                                <button onClick={handleCaptchaVerify}>Verify Captcha</button>
                            </div>
                        </div>
                        <div className="form-group">
                            <button onClick={handleSignup}>Sign Up as Student</button>
                        </div>
                    </div>
                    <div className="toggle-link" onClick={toggleForms}>
                        Already have an account? Login here
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

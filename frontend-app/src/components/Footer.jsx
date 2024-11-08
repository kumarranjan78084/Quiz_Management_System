import React from 'react';
import '../style/footer.css'; // Assuming you have a separate CSS file for styling

const Footer = () => {
    return (
        <div className="About" id='about'>
            <div className="about-us">
                <ul>
                    <li style={{maxWidth:'27%'}}>
                        <h1 style={{margin:'5px 0',color:'rgb(6 183 129)', fontFamily:'cursive'}}> QUIZ CREATER </h1>
                        <span className="icon">
                            <img src="../Assets/logo3.png" alt="" style={{ height: '45px', margin:'0px'}} />
                        </span>
                        <p style={{color:'white', margin:'5px 0'}}>Our intuitive quiz creator empowers educators and trainers to design engaging quizzes 
                            tailored to their audience, track progress, and provide instant feedback.
                        </p>
                        <span className="contact">
                            <i className="fa-regular fa-envelope"></i>
                            kumarravi78084@gmail.com
                        </span>
                        <span className="contact">
                            <i className="fa-solid fa-phone"></i>
                            +91-7808411285
                        </span>
                    </li>
                    <li>
                        <h3>Sections</h3>
                        <a href="#">SEO</a>
                        <a href="#">News</a>
                        <a href="#">Career</a>
                        <a href="#">Social Media</a>
                        <a href="#">Content</a>
                        <a href="#">WordPress</a>
                        <a href="#">Web Development</a>
                    </li>
                    <li>
                        <h3>Resources</h3>
                        <a href="#">Analytics Data</a>
                        <a href="#">Library</a>
                        <a href="#">E-Books</a>
                        <a href="#">Webinars</a>
                        <a href="#">Updates</a>
                    </li>
                    <li>
                        <h3>Advertise</h3>
                        <a href="#">Google ads</a>
                        <a href="#">Banner Ads</a>
                    </li>
                    <li>
                        <h3>Company</h3>
                        <a href="#">Subscribe</a>
                        <a href="#">About</a>
                        <a href="#">Info</a>
                        <a href="#">Privacy Policy</a>
                    </li>
                </ul>
            </div>
            <footer className="footer">
                <div className="social-links">
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube"></i> YouTube
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-telegram"></i> Telegram
                    </a>
                </div>
                <p>© 2024 Quiz Creater. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

export default Footer;

import React, { useState,useEffect } from 'react';
import Typed from 'typed.js';
import { Link } from 'react-router-dom';
import '../style/home.css';
import Footer from './Footer';
import Navbar1 from './Navbar1';

const Home = ({ user,userType, onLogout }) => {

    useEffect(() => {
        const cards = document.querySelectorAll('.card');
    
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              } else {
                entry.target.classList.remove('visible'); 
              }
            });
          },
          { threshold: 0.5 } 
        );
    
        cards.forEach((card, index) => {
            if (index % 2 === 0) {
              card.classList.add('left-transition'); // Cards with even index move from left
            } else {
              card.classList.add('right-transition'); // Cards with odd index move from right
            }
            observer.observe(card);
          });
      
          return () => {
            cards.forEach((card) => observer.unobserve(card));
          };
        }, []);
    

    const [menuVisible, setMenuVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const toggleMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        const typed = new Typed(".text", {
            strings: ["Create Online Quiz for Colleges"],
            typeSpeed: 70,
            backSpeed: 20,
            backDelay: 400,
            loop: true
        });
        return () => {
            typed.destroy();
       };
    }, []);

    return (
        <div className="home" id='home'>
            <div className={darkMode ? 'dark-mode' : 'light-mode'}>
                <Navbar1
                    userType={userType}
                    user={user}
                    onLogout={onLogout}
                    menuVisible={menuVisible}
                    toggleMenu={toggleMenu}
                    darkMode={darkMode}
                    toggleMode={toggleMode}
                />
            </div>
            <div className="logo">
                <span className="icon">
                    <img src="../Assets/logo3.png" alt="" />
                </span>
            </div>
            <div className="content">
                <div className="left">
                    <span className="logo-name">
                        <i className="fa-solid fa-chart-simple fa-rotate-270" style={{color: "rgb(6 183 129)"}}></i>
                        <h1>QUIZ CREATER</h1>
                    </span>
                    <h1 style={{color:'rgb(58 58 52)'}}>Hello, Professors</h1>
                    <h1 style={{color:'rgb(58 58 52)'}}><span className='text'></span></h1>
                    <div className="img">
                        <img src="../Assets/wide-image.jpg" alt="" />
                    </div>
                    <div className="btn-class">
                        <button className='btn'>
                            Explore <Link to="/login">
                                <i className="fa-solid fa-arrow-up-right-from-square" style={{margin:'0px 10px'}}></i>
                                </Link>
                        </button>
                    </div>
                </div>
                <div className='image'>
                    <img src="../Assets/image3.jpg" alt="img" />
                </div>
            </div>
            <div id='topics' className="topics">
                <h1>Quiz Topics </h1>
                <hr style={{display:'flex',width:'98%'}}/>
                <span className="card">
                <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"   ></i>
                        </div>
                        <h2>Database Management System</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://people.vts.su.ac.rs/~peti/Baze%20podataka/Literatura/Silberschatz-Database%20System%20Concepts%206th%20ed.pdf"
                            target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-file-pdf"   ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=kBdlM6hNDAE&list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y" target="_blank" rel="noopener noreferrer" >
                                <i className="fa-solid fa-circle-play"   ></i>
                            </a>
                        </div>
                    </span>
                    <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"    ></i>
                        </div>
                        <h2>Object Oriented Programming</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://www.nios.ac.in/media/documents/330srsec/online_course_material_330/Theory/Lesson_13.pdf"
                            target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-file-pdf"   ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=bn3zKuU6gwI&list=PLsyeobzWxl7rb5KatAnlvZFgLQ8RS4091"  target="_blank" rel="noopener noreferrer" >
                                <i className="fa-solid fa-circle-play"    ></i>
                            </a>
                        </div>
                    </span>
                    <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"    ></i>
                        </div>
                        <h2>Computer Organization and Architecture</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://vardhaman.org/wp-content/uploads/2021/03/CO.pdf" target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-file-pdf"   ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=QrL7CUBVF0c&list=PLG9aCp4uE-s0xddCBjwMDnEVyc523WbA2"  target="_blank" rel="noopener noreferrer" >
                                <i className="fa-solid fa-circle-play"    ></i>
                            </a>
                        </div>
                    </span>
                </span>
                <span className="card">
                    <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"    ></i>
                        </div>
                        <h2>Data Structure and Algorithm</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://dl.ebooksworld.ir/books/Introduction.to.Algorithms.4th.Leiserson.Stein.Rivest.Cormen.MIT.Press.9780262046305.EBooksWorld.ir.pdf"
                            target="_blank" rel="noopener noreferrer"> 
                                <i className="fa-solid fa-file-pdf"   ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=AT14lCXuMKI&list=PLdo5W4Nhv31bbKJzrsKfMpo_grxuLl8LU"   target="_blank" rel="noopener noreferrer" >
                                <i className="fa-solid fa-circle-play"    ></i>
                            </a>
                        </div>
                    </span>
                    <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"    ></i>
                        </div>
                        <h2>Computer Network and  Communication</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://d5ofvi41ggben.cloudfront.net/e41af2d5-9532-48a9-a6d2-0c8c2d62a34a-1571836072414-cn.pdf" target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-file-pdf"  ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=pGWxdTJPjKE&list=PL3eEXnCBViH-hlNCNwdfV7VrEcTquANGa"  target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-circle-play"    ></i>
                            </a>
                        </div>
                    </span>
                    <span className="topic">
                        <div className="user">
                            <i className="fa-solid fa-users-line"    ></i>
                        </div>
                        <h2>Artificial Intelligence and Machine Learning</h2>
                        <div className='info-link'>
                            <button className='btn'>More Info 
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                            <a href="https://indico.fysik.su.se/event/6743/contributions/10372/attachments/4170/4795/PHerman_-_Intro_to_AI_and_ML_-_PDCSummerSchool19.pdf"
                            target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-file-pdf"   ></i>
                            </a>
                            <a href="https://www.youtube.com/watch?v=ad79nYk2keg&list=PLEiEAq2VkUULyr_ftxpHB6DumOq1Zz2hq"   target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-circle-play"    ></i>
                            </a>
                        </div>
                    </span>
                </span>
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
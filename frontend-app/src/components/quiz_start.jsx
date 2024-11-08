import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/quiz_start.css';

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return `${('0' + h).slice(-2)}:${('0' + m).slice(-2)}:${('0' + s).slice(-2)}`;
}

const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

const Quiz = ({ userID }) => {
    const [quizData, setQuizData] = useState(null);
    const [questions, setQuestions] = useState([]); 
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
    const [isResultVisible, setIsResultVisible] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [questionTimer, setQuestionTimer] = useState(null);
    const [quizTimer, setQuizTimer] = useState(null);
    const [acceptTnC, setAcceptTnC] = useState(false);
    const [feedback, setFeedback] = useState({ rating: 0, message: '' });
    const [quizID, setQuizID] = useState(''); 
    const [title, setTitle] = useState(null); 
    const [password, setPassword] = useState('');
    const [questionsNo, setQuestionsNo] = useState(null); 
    const [marks, setTotalMarks] = useState(null); 
    const [attemptDate, setAttemptDate] = useState('');
    const [totalScore, setTotalScore] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (isQuizStarted && quizTimer > 0) {
            const quizInterval = setInterval(() => {
                setQuizTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(quizInterval);
        } else if (quizTimer === 0 && !isSubmitted) { 
            handleSubmit();
        }
    }, [quizTimer, isQuizStarted, isSubmitted]);


    useEffect(() => {
        if (isQuizStarted && questionTimer > 0) {
            const questionInterval = setInterval(() => {
                setQuestionTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(questionInterval);
        } else if (questionTimer === 0) {
            handleNextQuestion();
        }
    }, [questionTimer, isQuizStarted]);


    const handleOptionChange = (e) => {
        setSelectedOptions({
            ...selectedOptions,
            [currentQuestionIndex]: e.target.value
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            if (quizData) {
                setQuestionTimer(Math.floor(convertDurationToSeconds(quizData.Duration) / quizData.Questions.length));
            }
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        if (isSubmitted) return;
        setIsSubmitted(true);
        setIsQuizFinished(true);
        setQuestionTimer(0);
        setQuizTimer(0);
    
        const score = calculateTotalMarks();
        setTotalScore(score);
    
        const currentDate = new Date().toISOString().split('.')[0];
        setAttemptDate(currentDate);
    
        const quizData = {
            StudentID: userID,
            QuizID: quizID,
            AttemptDate: currentDate,
            totalScore: score
        };
    
        if (!quizData.StudentID || !quizData.QuizID || !quizData.AttemptDate || quizData.totalScore === undefined) {
            alert('One or more fields are missing or invalid.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:4444/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });
    
            if (response.ok) {
                alert('Quiz results submitted successfully!');
            } else {
                alert('Error submitting quiz results. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz results:', error);
            alert('An unexpected error occurred: ' + error.message);
        }
    };    

    const handleStartQuiz = async (e) => {
        e.preventDefault();

        if (!acceptTnC) {
            alert("Please accept the Terms and Conditions to start the quiz.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4444/start-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quizID: quizID,
                    password: password
                })
            });

            const data = await response.json();
            if (data.success) {
                if (data.quizData.Questions.length === 0) {
                    alert("No question available");
                    return;
                }            
                setQuizData(data.quizData);
                setTitle(data.quizData.Title);
                setQuestionsNo(data.quizData.Questions.length); 
                setQuestions(data.quizData.Questions);
                setTotalMarks(data.quizData.total_mark);
                setQuizTimer(convertDurationToSeconds(data.quizData.Duration));
                const initialQuestionTimer = Math.floor(convertDurationToSeconds(data.quizData.Duration) / data.quizData.Questions.length);
                setQuestionTimer(initialQuestionTimer);
                setIsQuizStarted(true);
            } else {
                alert('Quiz ID or Password may be wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error starting quiz:', error);
            alert('An unexpected error occurred while starting the quiz: ' + error.message);
        }
    };

    const handleFeedbackChange = (e) => {
        setFeedback({ ...feedback, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (rating) => {
        setFeedback({ ...feedback, rating });
    };

    const handleFeedbackSubmit = async () => {


        if (isFeedbackSubmitted) return;
        const feedbackData = {
            studentID: userID,
            quizID: quizID,
            feedback_rating: feedback.rating,
            feedback_text: feedback.message,
        };

        try {
            const response = await fetch('http://localhost:4444/submit-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });
    
            if (response.ok) {
                alert(`Feedback submitted! Rating: ${feedback.rating}, Message: ${feedback.message}`);
                setIsFeedbackSubmitted(true);
            } else {
                alert('Error submitting feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('An unexpected error occurred: ' + error.message);
        }
        setIsResultVisible(true);
    };
    

    const handleShowResult = () => {
        setIsResultVisible(true);
    };

    const calculateTotalMarks = () => {
        let score = 0;
        questions.forEach((question, index) => {
            if (selectedOptions[index] === question.correctAnswer) {
                score += 1;
            }
        });
        return score;
    };

    return (
        <div className="quiz-container">
            <h1>Quiz Management System</h1>

            {!isQuizStarted && !isQuizFinished && (
                <div className="start-container">
                    <h2>Welcome to the Quiz</h2>
                    <div className="form-group">
                        <label htmlFor="quizid" style={{ display: "flex", margin: "5px" }}>Quiz ID:</label>
                        <input
                            type="text"
                            id="quizID" 
                            value={quizID} 
                            onChange={(e) => setQuizID(e.target.value)}
                            placeholder="Enter Quiz ID"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" style={{ display: "flex", margin: "5px" }}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                    <div className="terms-container">
                        <input
                            type="checkbox"
                            id="tnc"
                            checked={acceptTnC}
                            onChange={() => setAcceptTnC(!acceptTnC)}
                        />
                        <label htmlFor="tnc">I accept the Terms and Conditions</label>
                    </div>
                    <button onClick={handleStartQuiz} disabled={!acceptTnC}>Start Quiz</button>
                    <div className="go-back">
                        <Link to="/:name">Go to Home</Link>
                    </div>
                </div>
            )}

            {isQuizStarted && !isQuizFinished && (
                <div className="quiz-content">
                    <div className="group">
                        <h3 style={{ display: 'flex', justifyContent: 'center', fontWeight: '300', margin: '10px 0' }}>
                            Quiz Title: <span style={{ fontSize: '20px', color: 'blue', margin: '0 5px' }}>{title}</span>
                        </h3>
                        <h3 style={{ display: 'flex', justifyContent: 'center', fontWeight: '300', margin: '10px 0' }}>
                            Quiz ID: <span style={{ fontSize: '20px', color: 'blue', margin: '0 5px' }}>{quizID}</span>
                        </h3>
                    </div>
                    <div className="group">
                        <h3 style={{ display: 'flex', justifyContent: 'center', fontWeight: '300', margin: '10px 0' }}>
                            Total Questions: <span style={{ fontSize: '20px', color: 'blue', margin: '0 5px' }}>{questionsNo}</span>
                        </h3>
                        <h3 style={{ display: 'flex', justifyContent: 'center', fontWeight: '300', margin: '10px 0' }}>
                            Total Time: <span style={{ fontSize: '20px', color: 'blue', margin: '0 5px' }}>{formatTime(quizTimer)}</span>
                        </h3>
                    </div>

                    <div className="question-timer">
                        <h3 style={{margin:'10px', color:'red'}}>Time left for this question: {formatTime(questionTimer)}</h3>
                    </div>

                    <div className="question-container">
                        <h3 style={{margin:'10px'}}>Question {currentQuestionIndex + 1}:</h3>
                        <p style={{margin:'10px ', fontSize:'18px'}}>{questions[currentQuestionIndex]?.Question_text}</p>
                        <div className="options" style={{margin:'10px'}}>
                            {questions[currentQuestionIndex]?.Question_options.map((option, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        id={`option-${index}`}
                                        name="option"
                                        value={option}
                                        checked={selectedOptions[currentQuestionIndex] === option}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor={`option-${index}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                        {currentQuestionIndex === questions.length - 1 ? (
                            <button onClick={handleSubmit} style={{ margin: "10px" }}>Finish Quiz</button>
                        ) : (
                            <div>
                                <button onClick={handleNextQuestion} style={{ margin: "10px" }}>Next Question</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isQuizFinished && !isFeedbackSubmitted && (
                <div className="feedback-container">
                    <h2>Thank you for completing the quiz!</h2>
                    <div className="feedback-form">
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                    key={star}
                                    className={`fa-solid fa-star ${feedback.rating >= star ? 'selected' : ''}`}
                                    onClick={() => handleRatingChange(star)}
                                ></i>
                            ))}
                        </div>
                        <div className="txt">
                            <textarea
                                id="message"
                                name="message"
                                rows="4"
                                placeholder="Give your feedback here..."
                                value={feedback.message}
                                onChange={handleFeedbackChange}
                            />
                        </div>
                        <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
                    </div>
                </div>
            )}
            {isFeedbackSubmitted && !isResultVisible && (
                <div className="result-container" style={{display: 'flex', justifyContent: 'center'}}>
                    <button onClick={handleShowResult}>Show Results</button>
                </div>
            )}

            {isResultVisible && (
                <>
                <div className="answersheet-container">
                    <h1>Answer Sheet</h1>
                    <p style={{fontFamily: 'fantasy', fontStyle: 'italic', color: '#8830b5'}}>Total Marks: {calculateTotalMarks()} / {questions.length}</p>
                    {questions.map((question, index) => (
                        <div key={question.id} className="answer-summary">
                            <p><strong>Question {question.id}:</strong> {question.question}</p>
                            <p><strong>Your Answer:</strong> {selectedOptions[index] ? selectedOptions[index] : 'Not Attempted'}</p>
                            <p><strong>Correct Answer:</strong> {question.correct_answer}</p>

                            {selectedOptions[index] 
                                ? (
                                    selectedOptions[index] === question.correct_answer 
                                    ? <p>✔️ Correct</p> 
                                    : <p>❌ Wrong</p>
                                )
                                : <p>❌ Not Attempted</p>
                            }
                        </div>
                    ))}
                </div>

                <div className="go-back">
                    <Link to="/:name">Go to Home</Link>
                </div>
                </>
            )}
        </div>
    );
};

export default Quiz;

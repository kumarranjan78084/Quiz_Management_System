import React, { useState } from 'react';
import '../style/quiz.css'; 
import axios from 'axios'; 
import Modal from './pop_message';
import { Link } from 'react-router-dom';

const Quiz = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [numQuestions, setNumQuestions] = useState('');
    const [timePerQuestion, setTimePerQuestion] = useState('');
    const [quizId, setQuizId] = useState(null); 
    const [password, setPassword] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [marks, setMarks] = useState('');
    const [questions, setQuestions] = useState([]); 
    const [visibility, setVisibility] = useState({}); 

    const questionsData = {
        'basic-html': 20,
        'DBMS_Questions': 20,
        'python_programming': 20,
        'oop-concepts': 20
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        const totalDuration = numQuestions * timePerQuestion;

        try {
            const response = await axios.post('http://localhost:4444/create-quiz', {
                Title: quizTitle,
                Questions: numQuestions,
                Duration: totalDuration,
                CreatedDate: new Date(), 
                FacultyID: '10FI106', 
                Marks: marks
            });

            setQuizId(response.data.quizId); 
            setPassword(response.data.password);

            if(response.data.success){
                setShowModal(true);
            }

        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setQuizTitle('');
        setNumQuestions('');
        setTimePerQuestion('');
        setQuizId(null);
        setPassword(null);
        setMarks('');
        setQuestions([]);
        setVisibility({}); 
    };

    const fetchQuestions = async (topic) => {
        try {
            const response = await axios.get(`http://localhost:4444/questions?topic=${topic}`);
            setQuestions(response.data.questions); 
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const toggleQuestionsVisibility = (topic) => {
        setVisibility((prevVisibility) => ({
            ...prevVisibility,
            [topic]: !prevVisibility[topic],
        }));
        
        fetchQuestions(topic);
    };

    return (
        <div className="container">
            <h1>Quiz Management System</h1>
            <div className="quiz">
                <form className="quiz-form" onSubmit={handleSubmit}>
                    <label htmlFor="quiz-title">Quiz Title</label>
                    <input
                        type="text"
                        id="quiz-title"
                        name="quiz-title"
                        placeholder="Enter quiz title"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        required
                    />

                    <label htmlFor="quiz-questions">Number of Questions</label>
                    <input
                        type="number"
                        id="quiz-questions"
                        name="quiz-questions"
                        placeholder="Enter number of questions"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        required
                    />

                    <label htmlFor="time-questions">Time for Each Question (seconds)</label>
                    <input
                        type="number"
                        id="time-questions"
                        name="time-questions"
                        placeholder="Enter time for each question"
                        value={timePerQuestion}
                        onChange={(e) => setTimePerQuestion(e.target.value)}
                        required
                    />

                    <label htmlFor="marks-questions">Total Marks for Quiz</label>
                    <input
                        type="number"
                        id="marks-questions"
                        name="marks-questions"
                        placeholder="Enter Total Marks for This Quiz"
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        required
                    />

                    <button type="submit">Create Quiz</button>
                </form>

                <div className="quiz-list">
                    <h2>Available Questions</h2>
                    {Object.entries(questionsData).map(([topic, numQuestions], index) => (
                        <div className="quiz-item" key={index}>
                            <div>
                                <h3>Topic {index + 1}: {topic.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase())}</h3>
                                <p>Questions: {numQuestions}</p>
                            </div>
                            <button 
                                id="show-btn" 
                                onClick={() => toggleQuestionsVisibility(topic)}
                            >
                                {visibility[topic] ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="go-back">
                <Link to="/name"> Go to Home</Link>
            </div>
            {showModal && <Modal quizId={quizId} password={password} onClose={closeModal} />}
            {Object.entries(visibility).map(([topic, isVisible]) => (
                isVisible && (
                    <div className="show-questions" key={topic}>
                        <h2>Questions for {topic.replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase())}</h2>
                        <ul>
                            {questions.map((question, questionIndex) => (
                                <li key={questionIndex} style={{listStyle: 'none'}}>
                                    <div className="question-section">
                                        <input
                                            type="checkbox"
                                            id={`select-question-${questionIndex}`}
                                            name="selected-questions"
                                            value={questionIndex}
                                        />
                                        <label htmlFor={`select-question-${questionIndex}`}>
                                            <strong>{questionIndex + 1}. {question.question}</strong>
                                        </label>
                                        <ul>
                                            {question.options.map((option, optionIndex) => (
                                                <li key={optionIndex}>{option}</li>
                                            ))}
                                        </ul>
                                        <div className="correct-answer">
                                            <p><strong>Correct Answer:</strong> {question.answer}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            ))}
        </div>
    );
}

export default Quiz;

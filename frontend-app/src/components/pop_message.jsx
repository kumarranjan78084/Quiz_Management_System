import React from 'react';
import '../style/pop_message.css';

const Modal = ({ quizId, password, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Quiz Created Successfully!</h3>
                <p>Your Quiz ID is: <strong style={{ fontSize: '1.5em', color:"blue" }}>{quizId}</strong></p>
                <p>Your password for this Quiz is: <strong style={{ fontSize: '1.5em',color:"blue" }}>{password}</strong></p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;

const express = require("express");
const cors = require('cors');
const quizRouter = require('./API/Quiz'); 
const signupRouter = require('./API/Signup'); 
const loginRouter = require('./API/Login'); 
const startQuizRouter = require('./API/Start_Quiz');
const submitRouter = require('./API/Submit_Quiz');
const feedbackRouter = require('./API/Student_Feedback');
const questionRouter = require('./API/Questions');
const bodyParser = require('body-parser');

const app = express();
const port = 4444;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Home page
app.get("/", (req, res) => {
    return res.send("<h1>Hello</h1>");
});




app.use('/create-quiz', quizRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/start-quiz',startQuizRouter);
app.use('/submit-quiz',submitRouter);
app.use('/submit-feedback',feedbackRouter);
app.use('/questions',questionRouter);




// User profile route
app.get("/user/:name", (req, res) => {
    const name = req.params.name;
    return res.send(`<h1>Hello ${name}</h1>`);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

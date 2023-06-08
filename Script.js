const DATABASE_KEY = 'customerSurvey';
const questions = [
  { id: 1, text: 'How satisfied are you with our products?', type: 'rating' },
  { id: 2, text: 'How fair are the prices compared to similar retailers?', type: 'rating' },
  { id: 3, text: 'How satisfied are you with the value for money of your purchase?', type: 'rating' },
  { id: 4, text: 'On a scale of 1-10, how likely are you to recommend us to your friends and family?', type: 'recommendation' },
  { id: 5, text: 'What could we do to improve our service?', type: 'text' }
];

let currentQuestionIndex = 0;
let customerSessionId = generateSessionId();
let answers = {};

function startSurvey() {
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('survey-screen').style.display = 'block';
  showQuestion();
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
  document.getElementById('question-text').textContent = currentQuestion.text;

  document.getElementById('rating-container').style.display = 'none';
  document.getElementById('recommendation-container').style.display = 'none';
  document.getElementById('text-answer-container').style.display = 'none';
  document.getElementById('previous-btn').disabled = currentQuestionIndex === 0;
  document.getElementById('next-btn').textContent = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next';
  if (currentQuestion.type === 'rating') {
    document.getElementById('rating-container').style.display = 'block';
  } else if (currentQuestion.type === 'recommendation') {
    document.getElementById('recommendation-container').style.display = 'block';
  } else if (currentQuestion.type === 'text') {
    document.getElementById('text-answer-container').style.display = 'block';
  }
}
function previousQuestion() {
  currentQuestionIndex--;
  showQuestion();
}

function nextQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  let answer = null;

  if (currentQuestion.type === 'rating') {
    const ratingInputs = document.getElementsByName('rating');
    for (const input of ratingInputs) {
      if (input.checked) {
        answer = parseInt(input.value);
        break;
      }
    }
  } else if (currentQuestion.type === 'recommendation') {
    answer = parseInt(document.getElementById('recommendation-rating').value);
  } else if (currentQuestion.type === 'text') {
    answer = document.getElementById('text-answer').value;
  }

  answers[currentQuestion.id] = answer;
  currentQuestionIndex++;

  if (currentQuestionIndex === questions.length) {
    saveSurveyData();
    showThankYouScreen();
  } else {
    showQuestion();
  }
}

function skipQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

function saveSurveyData() {
  let surveyData = JSON.parse(localStorage.getItem(DATABASE_KEY)) || {};
  surveyData[customerSessionId] = answers;
  localStorage.setItem(DATABASE_KEY, JSON.stringify(surveyData));
}

function showThankYouScreen() {
  document.getElementById('survey-screen').style.display = 'none';
  document.body.innerHTML = '<h1>Thank you for taking the survey!</h1>';
}

function generateSessionId() {
  // Generate a random session ID
  const timestamp = new Date().getTime();
  const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomId}`;
}
function showThankYouScreen() {
    document.getElementById('survey-screen').style.display = 'none';
  
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to submit the survey?');
    if (confirmed) {
      saveSurveyData();
      setSurveyStatus('COMPLETED');
      document.body.innerHTML = '<h1>Thank you for taking the survey!</h1>';
      setTimeout(showWelcomeScreen, 5000);
    } else {
      showWelcomeScreen();
    }
  }
  
  function showWelcomeScreen() {
    document.body.innerHTML = `
      <div id="welcome-screen">
        <h1>Welcome back!</h1>
        <button onclick="startSurvey()">Start</button>
      </div>
    `;
  }
  

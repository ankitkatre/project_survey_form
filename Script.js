const questions = [
  {
    id: 1,
    question: 'How satisfied are you with our products?',
    type: 'rating',
    options: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    question: 'How fair are the prices compared to similar retailers?',
    type: 'rating',
    options: [1, 2, 3, 4, 5]
  },
  {
    id: 3,
    question: 'How satisfied are you with the value for money of your purchase?',
    type: 'rating',
    options: [1, 2, 3, 4, 5]
  },
  {
    id: 4,
    question: 'On a scale of 1-10, how likely are you to recommend us to your friends and family?',
    type: 'rating',
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 5,
    question: 'What could we do to improve our service?',
    type: 'text'
  }
];

let currentQuestionIndex = 0;

function initializeSurvey() {
  const startBtn = document.getElementById('startBtn');
  const surveyContainer = document.getElementById('surveyContainer');

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    surveyContainer.style.display = 'block';
    showQuestion(currentQuestionIndex);
  });
}

function showQuestion(questionIndex) {
  const questionNumber = document.getElementById('questionNumber');
  const questionElement = document.getElementById('question');
  const answerContainer = document.getElementById('answerContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const submitBtn = document.getElementById('submitBtn');

  const { id, question, type, options } = questions[questionIndex];

  questionNumber.textContent = `Question ${questionIndex + 1}/${questions.length}`;
  questionElement.textContent = question;
  answerContainer.innerHTML = '';

  if (type === 'rating') {
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';

    options.forEach(option => {
      const radioBtn = document.createElement('input');
      radioBtn.type = 'radio';
      radioBtn.name = 'answer';
      radioBtn.value = option;
      radioGroup.appendChild(radioBtn);

      const label = document.createElement('label');
      label.textContent = option;
      radioGroup.appendChild(label);
    });

    answerContainer.appendChild(radioGroup);
  } else if (type === 'text') {
    const textArea = document.createElement('textarea');
    textArea.name = 'answer';
    answerContainer.appendChild(textArea);
  }

  prevBtn.disabled = questionIndex === 0;

  if (questionIndex === questions.length - 1) {
    nextBtn.style.display = 'none';

    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';

    submitBtn.style.display = 'none';
  }

  bindAnswerEvents();
}

function bindAnswerEvents() {
  const answerInputs = document.querySelectorAll('input[name="answer"]');
  const textArea = document.querySelector('textarea[name="answer"]');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');

  answerInputs.forEach(input => {
    input.addEventListener('change', () => {
      nextBtn.disabled = false;
    });
  });

  if (textArea) {
    textArea.addEventListener('input', () => {
      nextBtn.disabled = false;
    });
  }

  prevBtn.addEventListener('click', () => {
    currentQuestionIndex--;
    showQuestion(currentQuestionIndex);
  });

  nextBtn.addEventListener('click', () => {
    saveAnswer();
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex);
  });



  // submitBtn.addEventListener('click', () => {
    // if (confirm('Are you sure you want to submit the survey?')) {
      // saveAnswer('');
      // setSurveyStatus('COMPLETED');
      // showThankYouScreen();
    // }
  // });
}

function saveAnswer() {
  const answerInputs = document.querySelectorAll('input[name="answer"]');
  const textArea = document.querySelector('textarea[name="answer"]');

  let answer;

  if (answerInputs.length > 0) {
    answer = Array.from(answerInputs).find(input => input.checked)?.value;
  } else if (textArea) {
    answer = textArea.value;
  }

  if (answer) {
    const questionId = questions[currentQuestionIndex].id;
    localStorage.setItem(`answer_${questionId}`, answer);
  }
}

function setSurveyStatus(status) {
  localStorage.setItem('surveyStatus', status);
}

function showThankYouScreen() {
  const surveyContainer = document.getElementById('surveyContainer');
  const thankYouContainer = document.getElementById('thankYouContainer');

  surveyContainer.style.display = 'none';
  thankYouContainer.style.display = 'block';

  setTimeout(() => {
    surveyContainer.style.display = 'block';
    thankYouContainer.style.display = 'none';
    resetSurvey();
  }, 5000);
}

function resetSurvey() {
  currentQuestionIndex = 0;
  const startBtn = document.getElementById('startBtn');
  startBtn.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', initializeSurvey);

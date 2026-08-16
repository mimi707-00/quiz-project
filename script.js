const quizData = [
  {
    question: "Do you have a girlfriend?",
    options: ["Yes", "No"],
    correct: 1,
    image: "images/photo1.jpg"
  },
  {
    question: "Which option best describe your gf",
    options: ["Nice, Simple, Boring", "Cute, Funny, Beautiful", "Ugly, Annoying, Crybaby", "Uhh No Comment"],
    correct: 1,
    image: "images/photo2.jpg"
  },
  {
    question: "What's my go-to comfort food?",
    options: ["Pizza", "Ice Cream", "Fried Chicken", "Instant Noodles"],
    correct: 0
  },
  {
    question: "How did we first meet?",
    options: ["Through friends", "School/Work", "Social Media", "Random encounter"],
    correct: 0
  },
  {
    question: "What's my biggest pet peeve?",
    options: ["Being late", "Loud chewing", "Messy rooms", "Bad drivers"],
    correct: 0
  },
  {
    question: "What's my love language?",
    options: ["Words of Affirmation", "Quality Time", "Physical Touch", "Acts of Service"],
    correct: 0
  },
  {
    question: "What's the most annoying thing your gf do?",
    options: ["Overthinking", "Taking forever to reply", "Being too clingy", "Being stubborn"],
    correct: 0
  },
  {
    question: "Favourite date?",
    options: ["Netflix and discord", "Going out for food", "Playing games", "Grocery shopping"],
    correct: 3
  }
];

const SWAP_QUESTION_INDEX = 1;
const SWAP_OPTION_A = "Cute, Funny, Beautiful";
const SWAP_OPTION_B = "Ugly, Annoying, Crybaby";

let currentQuestion = 0;
let playerName = "";
let correctCount = 0;
let wrongCount = 0;
let posA = null;
let posB = null;

const startView = document.getElementById("startView");
const questionView = document.getElementById("questionView");
const answerView = document.getElementById("answerView");
const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const questionNextBtn = document.getElementById("questionNextBtn");
const resultText = document.getElementById("resultText");
const correctAnswerText = document.getElementById("correctAnswerText");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const answerImage = document.getElementById("answerImage");
const finishView = document.getElementById("finishView");
const finishText = document.getElementById("finishText");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restartBtn");

let musicOn = true;
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const completeSound = document.getElementById("completeSound");

bgMusic.volume = 0.3;
clickSound.volume = 0.5;
correctSound.volume = 0.6;
wrongSound.volume = 0.6;
completeSound.volume = 0.6;

function playSound(audioEl) {
  if (!musicOn) return;
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}

function playClickSound() { playSound(clickSound); }
function playCorrectSound() { playSound(correctSound); }
function playWrongSound() { playSound(wrongSound); }
function playCompleteSound() { playSound(completeSound); }

function startBackgroundMusic() {
  if (!musicOn) return;
  bgMusic.play().catch(() => {});
}

function stopBackgroundMusic() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
}

const muteBtn = document.getElementById("muteBtn");
muteBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  muteBtn.textContent = musicOn ? "🔊" : "🔇";
  if (musicOn) startBackgroundMusic();
  else stopBackgroundMusic();
});

startBtn.addEventListener("click", startQuiz);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});

function startQuiz() {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.style.borderColor = "#e53935";
    nameInput.placeholder = "Please enter your name!";
    return;
  }
  playerName = name;
  startView.classList.add("hidden");
  startBackgroundMusic();
  loadQuestion();
}

function loadQuestion() {
  questionView.classList.remove("hidden");
  answerView.classList.add("hidden");
  questionNextBtn.classList.add("hidden");

  const q = quizData[currentQuestion];
  progressEl.textContent = `${playerName} — Question ${currentQuestion + 1} of ${quizData.length}`;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  if (currentQuestion === SWAP_QUESTION_INDEX) {
    posA = q.options.indexOf(SWAP_OPTION_A);
    posB = q.options.indexOf(SWAP_OPTION_B);
  }

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";
    btn.addEventListener("click", () => {
      playClickSound();
      selectAnswer(index);
    });
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  if (currentQuestion === SWAP_QUESTION_INDEX) {
    handleSwapAnswer(selectedIndex);
    return;
  }

  const q = quizData[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  if (isCorrect) {
    correctCount++;
  } else {
    wrongCount++;
  }

  showAnswerView(isCorrect, q.options[q.correct], q.image);
  nextBtn.textContent = currentQuestion === quizData.length - 1 ? "Finish" : "Next Question →";
}

function handleSwapAnswer(selectedIndex) {
  const q = quizData[SWAP_QUESTION_INDEX];
  const buttons = document.querySelectorAll("#options .option-btn");
  let isCorrect = false;

  if (selectedIndex === posA) {
    q.options[posA] = SWAP_OPTION_B;
    q.options[posB] = SWAP_OPTION_A;
    buttons[posA].textContent = SWAP_OPTION_B;
    buttons[posB].textContent = SWAP_OPTION_A;

    const temp = posA;
    posA = posB;
    posB = temp;

    isCorrect = false;
    buttons[selectedIndex].classList.add("incorrect");
  } else if (selectedIndex === posB) {
    q.options[posB] = SWAP_OPTION_A;
    q.options[posA] = SWAP_OPTION_B;
    buttons[posB].textContent = SWAP_OPTION_A;
    buttons[posA].textContent = SWAP_OPTION_B;

    const temp = posA;
    posA = posB;
    posB = temp;

    isCorrect = true;
    buttons[selectedIndex].classList.add("correct");
  } else {
    isCorrect = false;
    buttons[selectedIndex].classList.add("incorrect");
  }

  buttons.forEach((btn) => (btn.disabled = true));
  questionNextBtn.dataset.correct = isCorrect;
  questionNextBtn.classList.remove("hidden");
}

questionNextBtn.addEventListener("click", () => {
  playClickSound();
  const q = quizData[SWAP_QUESTION_INDEX];
  const isCorrect = questionNextBtn.dataset.correct === "true";

  if (isCorrect) {
    correctCount++;
  } else {
    wrongCount++;
  }

  showAnswerView(isCorrect, SWAP_OPTION_A, q.image);
  nextBtn.textContent = "Next Question →";
});

function showAnswerView(isCorrect, correctAnswerLabel, image) {
  questionView.classList.add("hidden");
  answerView.classList.remove("hidden");

  isCorrect ? playCorrectSound() : playWrongSound();

  resultText.textContent = isCorrect ? "✅ Correct!" : "❌ Wrong!";
  resultText.className = isCorrect ? "correct" : "incorrect";
  correctAnswerText.textContent = `The correct answer was: "${correctAnswerLabel}"`;

  if (image) {
    answerImage.src = image;
    answerImage.style.display = "block";
  } else {
    answerImage.style.display = "none";
  }
}

nextBtn.addEventListener("click", () => {
  playClickSound();
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    answerView.classList.add("hidden");
    finishView.classList.remove("hidden");
    finishText.textContent = `🎉 Nice work, ${playerName}!`;
    scoreText.textContent = `You got ${correctCount} correct and ${wrongCount} wrong out of ${quizData.length} questions.`;
    progressEl.textContent = "";
    stopBackgroundMusic();
    playCompleteSound();
  }
});

restartBtn.addEventListener("click", () => {
  playClickSound();
  currentQuestion = 0;
  playerName = "";
  correctCount = 0;
  wrongCount = 0;
  nameInput.value = "";
  nameInput.style.borderColor = "#ddd";
  nameInput.placeholder = "Your name";

  finishView.classList.add("hidden");
  startView.classList.remove("hidden");
  startBackgroundMusic();
});

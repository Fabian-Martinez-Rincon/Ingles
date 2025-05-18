let questions = [];
let currentQuestion = 0;
let score = 0;
let hasTriedOnce = false;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const resultBox = document.getElementById("resultBox");

function loadQuestion() {
  hasTriedOnce = false;
  if (currentQuestion < questions.length) {
    questionText.textContent = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;
    answerInput.value = "";
    feedback.textContent = "";
    answerInput.focus();
  } else {
    showResult(score, questions.length);
  }
}

submitBtn.addEventListener("click", () => {
  const userAnswer = normalize(answerInput.value);
  const q = questions[currentQuestion];

  const rawAnswers = Array.isArray(q.answers)
    ? q.answers
    : typeof q.answer === 'string'
      ? [q.answer]
      : [];

  const correctAnswers = rawAnswers.map(normalize);

  if (userAnswer === "") {
    feedback.textContent = "Por favor, escribí una respuesta.";
    return;
  }

  if (correctAnswers.includes(userAnswer)) {
    score++;
    feedback.textContent = "¡Correcto!";
    feedback.className = "correct";
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 800);
  } else {
    if (!hasTriedOnce) {
      hasTriedOnce = true;
      const hint = q.hint ? `<br><em>Pista:</em> ${q.hint}` : "";
      feedback.innerHTML = `Incorrecto. Intentá una vez más.${hint}`;
      feedback.className = "incorrect";
      answerInput.focus();
    } else {
      const original = rawAnswers.join(" / ");
      feedback.innerHTML = `Incorrecto. Respuesta esperada: "${original}"`;
      feedback.className = "incorrect";
      setTimeout(() => {
        currentQuestion++;
        loadQuestion();
      }, 1600);
    }
  }
});

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitBtn.click();
  }
});

fetch('../../data/palabras_1.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
  })
  .catch(err => {
    questionText.textContent = "Error al cargar las preguntas.";
    console.error("Error:", err);
  });

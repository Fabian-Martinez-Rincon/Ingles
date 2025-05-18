let questions = [];
let currentQuestion = 0;
let score = 0;
let hasTriedOnce = false;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const resultBox = document.getElementById("resultBox");

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,/#!$%^&*;:{}=_`~()?¿¡!"'«»]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function loadQuestion() {
  hasTriedOnce = false;
  if (currentQuestion < questions.length) {
    questionText.textContent = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;
    answerInput.value = "";
    feedback.textContent = "";
    answerInput.focus();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("questionBox").style.display = "none";
  resultBox.style.display = "block";
  const grade = (score / questions.length * 10).toFixed(2);
  resultBox.innerHTML = `
    <h2>Resultado Final</h2>
    <p>Puntaje: ${score} / ${questions.length}</p>
    <p>Nota: ${grade}</p>
  `;
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

// ENTER simula clic
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitBtn.click();
  }
});

// Cargar preguntas
fetch('./palabras/palabras_1.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
  })
  .catch(err => {
    questionText.textContent = "Error al cargar las preguntas.";
    console.error("Error:", err);
  });

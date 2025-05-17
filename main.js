let questions = [];
let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const resultBox = document.getElementById("resultBox");

// Normaliza el texto: elimina acentos, puntuación, mayúsculas y espacios
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")         // quitar acentos
    .replace(/[.,/#!$%^&*;:{}=_`~()?¿¡!"'«»]/g, "")  // quitar signos
    .replace(/\s+/g, " ")                    // espacios simples
    .toLowerCase()
    .trim();
}

function loadQuestion() {
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

  // Asegura compatibilidad con 'answer' o 'answers'
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
    const original = rawAnswers.join(" / ");
    feedback.textContent = `Incorrecto. Respuesta esperada: "${original}"`;
    feedback.className = "incorrect";
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 1600);
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

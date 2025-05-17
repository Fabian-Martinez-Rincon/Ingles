let questions = [];
let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const resultBox = document.getElementById("resultBox");

// Normaliza el texto: elimina acentos, espacios y lo pasa a minúscula
function normalize(text) {
  return text
    .normalize("NFD")                     // descompone caracteres con tilde
    .replace(/[\u0300-\u036f]/g, "")     // elimina los diacríticos
    .toLowerCase()                       // todo en minúscula
    .trim();                             // sin espacios al inicio/fin
}

function loadQuestion() {
  if (currentQuestion < questions.length) {
    questionText.textContent = `${currentQuestion + 1}. ${questions[currentQuestion].question}`;
    answerInput.value = "";
    feedback.textContent = "";
    answerInput.focus(); // Auto-focus en el input
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

// Responder con botón o Enter
submitBtn.addEventListener("click", () => {
  const userAnswer = normalize(answerInput.value);
  const correctAnswers = questions[currentQuestion].answers.map(normalize);

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
    const originalAnswers = questions[currentQuestion].answers.join(" / ");
    feedback.textContent = `Incorrecto. Las respuestas posibles son: "${originalAnswers}"`;
    feedback.className = "incorrect";
    setTimeout(() => {
      currentQuestion++;
      loadQuestion();
    }, 1600);
  }
});

// ENTER simula click en "Responder"
answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitBtn.click();
  }
});

// Cargar preguntas desde el archivo JSON
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

let questions = [];
let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  if (currentQuestion < questions.length) {
    const q = questions[currentQuestion];

    // Mostrar la pregunta
    document.getElementById("questionText").textContent = `${currentQuestion + 1}. ${q.question}`;

    // Setear la respuesta pero aún sin mostrarla claramente
    document.getElementById("answerText").textContent = Array.isArray(q.answers)
      ? q.answers.join(" / ")
      : q.answer;

    // Ocultar visualmente respuesta y botones
    document.getElementById("answerDisplay").classList.remove("visible");
    document.getElementById("buttonsContainer").classList.remove("visible");
  } else {
    showResult(score, questions.length);
  }
}

function showAnswer() {
  // Mostrar respuesta y botones con opacidad y visibilidad
  document.getElementById("answerDisplay").classList.add("visible");
  document.getElementById("buttonsContainer").classList.add("visible");
}

function handleAnswer(isCorrect) {
  if (isCorrect) score++;
  currentQuestion++;
  loadQuestion();
}

// Cargar preguntas desde JSON
fetch('../../data/palabras_1.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    loadQuestion();
  })
  .catch(err => {
    document.getElementById("questionText").textContent = "Error al cargar las preguntas.";
    console.error("Error:", err);
  });

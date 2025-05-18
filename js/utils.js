function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,/#!$%^&*;:{}=_`~()?¿¡!"'«»]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function showResult(score, total) {
  const resultBox = document.getElementById("resultBox");
  const grade = ((score / total) * 10).toFixed(2);
  document.getElementById("questionBox").style.display = "none";
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <h2>Resultado Final</h2>
    <p>Puntaje: ${score} / ${total}</p>
    <p>Nota: ${grade}</p>
  `;
}

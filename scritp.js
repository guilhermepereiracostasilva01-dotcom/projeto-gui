

const perguntas = [
  {
    pergunta: "Qual é a capital do Brasil?",
    alternativas: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
    correta: 1
  },
  {
    pergunta: "Qual planeta é conhecido como Planeta Vermelho?",
    alternativas: ["Vênus", "Júpiter", "Marte", "Saturno"],
    correta: 2
  },
  {
    pergunta: "Quanto é 8 x 7?",
    alternativas: ["48", "54", "56", "64"],
    correta: 2
  },
  {
    pergunta: "Qual é o maior oceano do planeta?",
    alternativas: [
      "Oceano Atlântico",
      "Oceano Índico",
      "Oceano Ártico",
      "Oceano Pacífico"
    ],
    correta: 3
  },
  {
    pergunta: "Qual linguagem é usada para estruturar páginas web?",
    alternativas: ["HTML", "SQL", "Python", "C++"],
    correta: 0
  }
];

const telaQuiz = document.querySelector("#tela-quiz");
const telaResultado = document.querySelector("#resultado");
const form = document.querySelector("#form-quiz");
const campoAlternativas = document.querySelector("#alternativas");
const campoPergunta = document.querySelector("#pergunta");
const feedback = document.querySelector("#feedback");
const progresso = document.querySelector("#progresso");
const pontuacao = document.querySelector("#pontuacao");
const barra = document.querySelector("#progresso-barra");
const anterior = document.querySelector("#anterior");
const proximo = document.querySelector("#proximo");

let indiceAtual = 0;
let respostas = Array(perguntas.length).fill(null);
let respondidas = Array(perguntas.length).fill(false);

function calcularPontos() {
  return respostas.reduce((total, resposta, indice) => {
    return total + (resposta === perguntas[indice].correta ? 1 : 0);
  }, 0);
}

function atualizarPontuacao() {
  pontuacao.textContent =
    `Pontos: ${calcularPontos()}`;
}

function mostrarPergunta() {
  const atual = perguntas[indiceAtual];

  progresso.textContent =
    `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;

  barra.style.width =
    `${((indiceAtual + 1) / perguntas.length) * 100}%`;

  campoPergunta.textContent = atual.pergunta;
  campoAlternativas.replaceChildren();

  atual.alternativas.forEach((texto, indice) => {
    const label = document.createElement("label");
    label.className = "opcao";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "resposta";
    input.value = indice;
    input.checked = respostas[indiceAtual] === indice;
    input.disabled = respondidas[indiceAtual];

    const span = document.createElement("span");
    span.textContent = texto;

    label.append(input, span);
    campoAlternativas.append(label);

    if (respondidas[indiceAtual]) {
      if (indice === atual.correta) {
        label.classList.add("correta");
      } else if (indice === respostas[indiceAtual]) {
        label.classList.add("errada");
      }
    }

    input.addEventListener("change", () => {
      if (respondidas[indiceAtual]) return;

      const acertou = indice === atual.correta;
      feedback.textContent = acertou
        ? "Resposta correta!"
        : "Resposta errada! Tente novamente.";

      feedback.style.color = acertou ? "#15803d" : "#dc2626";
    });
  });

  feedback.textContent = respondidas[indiceAtual]
    ? (respostas[indiceAtual] === atual.correta
        ? "Resposta correta!"
        : "Resposta errada.")
    : "";

  feedback.style.color =
    respostas[indiceAtual] === atual.correta
      ? "#15803d"
      : "#dc2626";

  anterior.disabled = indiceAtual === 0;

  proximo.textContent = respondidas[indiceAtual]
    ? (indiceAtual === perguntas.length - 1
        ? "Ver resultado"
        : "Próxima pergunta")
    : "Confirmar resposta";

  atualizarPontuacao();
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!respondidas[indiceAtual]) {
    const selecionada = form.querySelector(
      'input[name="resposta"]:checked'
    );

    if (!selecionada) {
      feedback.textContent = "Selecione uma alternativa primeiro.";
      feedback.style.color = "#dc2626";
      return;
    }

    respostas[indiceAtual] = Number(selecionada.value);
    respondidas[indiceAtual] = true;
    mostrarPergunta();
    return;
  }

  if (indiceAtual < perguntas.length - 1) {
    indiceAtual++;
    mostrarPergunta();
  } else {
    mostrarResultado();
  }
});

anterior.addEventListener("click", () => {
  if (indiceAtual > 0) {
    indiceAtual--;
    mostrarPergunta();
  }
});

function mostrarResultado() {
  telaQuiz.hidden = true;
  telaResultado.hidden = false;

  const pontos = calcularPontos();
  const total = perguntas.length;

  document.querySelector("#placar-final").textContent =
    `${pontos} de ${total} pontos`;

  document.querySelector("#mensagem-final").textContent =
    pontos === total
      ? "Parabéns! Você acertou todas!"
      : pontos >= total / 2
        ? "Muito bem! Continue praticando."
        : "Continue estudando e tente novamente!";
}

document.querySelector("#reiniciar").addEventListener("click", () => {
  indiceAtual = 0;
  respostas = Array(perguntas.length).fill(null);
  respondidas = Array(perguntas.length).fill(false);

  telaResultado.hidden = true;
  telaQuiz.hidden = false;

  mostrarPergunta();
});

mostrarPergunta();


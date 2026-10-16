/* =========================================================
   BOLETIM DIGITAL — 8º ANO
   Dados fictícios do "Estudante Exemplo"
   ========================================================= */

/* ---------------------------------------------------------
   VARIÁVEL: é uma "caixinha" onde guardamos um valor.
   ARRAY: é uma lista ordenada de valores, entre [ ].
   OBJETO: é um conjunto de pares chave/valor, entre { }.
   --------------------------------------------------------- */

// ARRAY de OBJETOS com os dados brutos de cada disciplina
const disciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Média mínima de referência
const MEDIA_MINIMA = 6.0;

/* =========================================================
   FUNÇÃO: é um bloco de código que faz uma tarefa.
   Recebe dados, processa e devolve um resultado.
   ========================================================= */

// Normaliza uma nota para a escala de 0 a 10
function normalizarNota(valor) {
  // Vazio, null ou undefined = nota ainda não lançada
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for string, troca vírgula por ponto
  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;

  // Converte para número
  numero = Number(numero);

  // Se não for número válido, considera inválido
  if (isNaN(numero)) {
    return null;
  }

  // Valores entre 0 e 10 permanecem iguais
  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  // Valores maiores que 10 e até 100 são divididos por 10
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras = inválido
  return null;
}

// Calcula a média usando somente as notas disponíveis
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

// Soma as faltas dos trimestres
function somarFaltas(faltas) {
  return faltas.reduce((acc, f) => acc + f, 0);
}

// Define a situação com base na média
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

// Formata número para exibir com vírgula e uma casa decimal
function formatarNota(numero) {
  if (numero === null) return "—";
  return numero.toFixed(1).replace(".", ",");
}

/* =========================================================
   IF: é uma estrutura condicional ("se... então").
   FOR EACH: percorre cada item de um array.
   DOM: é a representação da página HTML que o JS pode alterar.
   ========================================================= */

// Pega os elementos do DOM que vamos preencher
const corpoTabela = document.getElementById("corpo-tabela");
const areaCards = document.getElementById("cards");

// Variáveis para os totais gerais
let somaMedias = 0;
let totalMedias = 0;
let totalFaltas = 0;
let bonsDesempenhos = 0;
let atencao = 0;

// FOR EACH: percorre cada disciplina do array
disciplinas.forEach((item) => {
  // Normaliza as três notas
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  // Média e faltas
  const media = calcularMedia([n1, n2, n3]);
  const faltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  // Acumula totais gerais
  totalFaltas += faltas;
  if (media !== null) {
    somaMedias += media;
    totalMedias++;
  }
  if (situacao === "Bom desempenho") bonsDesempenhos++;
  if (situacao === "Atenção") atencao++;

  // Cria a linha da tabela
  const linha = document.createElement("tr");

  // Classe de cor para a situação
  let classeSituacao = "indisponivel";
  if (situacao === "Bom desempenho") classeSituacao = "bom";
  if (situacao === "Atenção") classeSituacao = "atencao";

  // Monta as células
  linha.innerHTML = `
    <td>${item.disciplina}</td>
    <td>${n1 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n1)}</td>
    <td>${n2 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n2)}</td>
    <td>${n3 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n3)}</td>
    <td><strong>${media === null ? "—" : formatarNota(media)}</strong></td>
    <td>${faltas}</td>
    <td><span class="situacao ${classeSituacao}">${situacao}</span></td>
  `;

  corpoTabela.appendChild(linha);
});

/* =========================================================
   CARDS DE RESUMO
   ========================================================= */

// Média geral de todas as disciplinas com nota disponível
const mediaGeral = totalMedias > 0 ? somaMedias / totalMedias : null;

// Frequência FICTÍCIA/DEMONSTRATIVA
// ATENÇÃO: este percentual é apenas demonstrativo.
// No futuro, a frequência será tratada de outra forma.
const frequenciaDemonstrativa = 92;

// Função para criar um card
function criarCard(icone, titulo, valor, corValor = "") {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="card-icone">${icone}</span>
    <p class="card-titulo">${titulo}</p>
    <p class="card-valor ${corValor}">${valor}</p>
  `;
  return card;
}

// Cria e adiciona os cards na página
areaCards.appendChild(criarCard("📊", "Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral), "turquesa"));
areaCards.appendChild(criarCard("📉", "Total de faltas", totalFaltas));
areaCards.appendChild(criarCard("✅", "Bom desempenho", bonsDesempenhos, "turquesa"));
areaCards.appendChild(criarCard("⚠️", "Precisam de atenção", atencao));
areaCards.appendChild(criarCard("📅", "Frequência", frequenciaDemonstrativa + "% — Frequência adequada"));
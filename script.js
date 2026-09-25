// ============================================================
// DADOS FICTÍCIOS DO BOLETIM — 8º ANO
// Estes são os "dados brutos". Algumas notas vêm como número,
// outras como texto com vírgula, outras como null (sem nota).
// ============================================================
const dadosBrutos = [
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

// ============================================================
// FUNÇÃO: normalizarNota(valor)
// Converte qualquer formato de nota para a escala 0–10.
// Regras:
//  - vazio, null ou undefined  -> null (nota ainda não lançada)
//  - 0 a 10                    -> mantém igual
//  - maior que 10 até 100      -> divide por 10
//  - aceita ponto ou vírgula
//  - valores fora das regras   -> null (inválido, não entra na média)
// ============================================================
function normalizarNota(valor) {
  // Nota ausente
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Se for texto, troca vírgula por ponto
  let numero;
  if (typeof valor === "string") {
    numero = parseFloat(valor.replace(",", "."));
  } else {
    numero = valor;
  }

  // Se não virou número válido, considera inválido
  if (isNaN(numero)) {
    return null;
  }

  // Regra das faixas
  if (numero >= 0 && numero <= 10) {
    return numero;
  }
  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

  // Fora das regras
  return null;
}

// ============================================================
// FUNÇÃO: calcularMedia(notas)
// Recebe um array com até 3 notas (já normalizadas ou null).
// Ignora as ausentes e faz a média só das disponíveis.
// Se não houver nenhuma válida, retorna null.
// ============================================================
function calcularMedia(notas) {
  const validas = notas.filter((n) => n !== null);
  if (validas.length === 0) return null;

  const soma = validas.reduce((acc, n) => acc + n, 0);
  return soma / validas.length;
}

// ============================================================
// FUNÇÃO: somarFaltas(faltas)
// Soma todos os números do array de faltas.
// ============================================================
function somarFaltas(faltas) {
  return faltas.reduce((acc, f) => acc + f, 0);
}

// ============================================================
// FUNÇÃO: definirSituacao(media)
// Decide a situação com base na média disponível.
// ============================================================
function definirSituacao(media) {
  if (media === null) return "Nota ainda não disponível";
  if (media >= MEDIA_MINIMA) return "Bom desempenho";
  return "Atenção";
}

// ============================================================
// FUNÇÃO: formatarNota(numero)
// Mostra a nota com uma casa decimal (ex.: 8,2) ou "—" se null.
// ============================================================
function formatarNota(numero) {
  if (numero === null) return "—";
  return numero.toFixed(1).replace(".", ",");
}

// ============================================================
// PROCESSAMENTO DOS DADOS
// Aqui montamos um novo array já com notas normalizadas,
// média, total de faltas e situação de cada disciplina.
// ============================================================
const disciplinasProcessadas = dadosBrutos.map((item) => {
  const n1 = normalizarNota(item.tri1);
  const n2 = normalizarNota(item.tri2);
  const n3 = normalizarNota(item.tri3);

  const media = calcularMedia([n1, n2, n3]);
  const totalFaltas = somarFaltas(item.faltas);
  const situacao = definirSituacao(media);

  return {
    disciplina: item.disciplina,
    tri1: n1,
    tri2: n2,
    tri3: n3,
    media: media,
    faltas: totalFaltas,
    situacao: situacao
  };
});

// ============================================================
// PREENCHER A TABELA
// Percorremos cada disciplina e criamos uma linha <tr>.
// ============================================================
function preencherTabela() {
  const corpo = document.getElementById("corpo-tabela");

  disciplinasProcessadas.forEach((d) => {
    const linha = document.createElement("tr");

    // Classe da situação para colorir
    let classeSituacao = "situacao-indisponivel";
    if (d.situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (d.situacao === "Atenção") classeSituacao = "situacao-atencao";

    linha.innerHTML = `
      <td>${d.disciplina}</td>
      <td>${formatarNota(d.tri1)}</td>
      <td>${formatarNota(d.tri2)}</td>
      <td>${formatarNota(d.tri3)}</td>
      <td>${formatarNota(d.media)}</td>
      <td>${d.faltas}</td>
      <td class="${classeSituacao}">${d.situacao}</td>
    `;

    corpo.appendChild(linha);
  });
}

// ============================================================
// PREENCHER OS CARDS DE RESUMO
// ============================================================
function preencherCards() {
  // Média geral: média das médias disponíveis
  const mediasDisponiveis = disciplinasProcessadas
    .map((d) => d.media)
    .filter((m) => m !== null);

  let mediaGeral = "—";
  if (mediasDisponiveis.length > 0) {
    const soma = mediasDisponiveis.reduce((acc, m) => acc + m, 0);
    mediaGeral = (soma / mediasDisponiveis.length).toFixed(1).replace(".", ",");
  }

  // Total de faltas geral
  const totalFaltas = disciplinasProcessadas.reduce((acc, d) => acc + d.faltas, 0);

  // Quantidade de disciplinas com bom desempenho e com atenção
  const bom = disciplinasProcessadas.filter((d) => d.situacao === "Bom desempenho").length;
  const atencao = disciplinasProcessadas.filter((d) => d.situacao === "Atenção").length;

  // Preenche os elementos
  document.getElementById("valor-media").textContent = mediaGeral;
  document.getElementById("valor-faltas").textContent = totalFaltas;
  document.getElementById("valor-bom").textContent = bom;
  document.getElementById("valor-atencao").textContent = atencao;

  // Frequência FICTÍCIA/DEMONSTRATIVA
  // IMPORTANTE: este valor é apenas demonstrativo nesta primeira versão.
  // No futuro, a frequência será tratada de outra forma (não calculada aqui).
  document.getElementById("valor-frequencia").textContent = "92%";
  document.getElementById("texto-frequencia").textContent = "Frequência adequada";

  // Se houver muitas disciplinas em atenção, destaca o card
  if (atencao > 0) {
    document.getElementById("card-atencao").classList.add("atencao");
  }
}

// ============================================================
// INICIALIZAÇÃO
// Executa as funções quando a página termina de carregar.
// ============================================================
preencherTabela();
preencherCards();
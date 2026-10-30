/* =========================================================
   BOLETIM DIGITAL — 8º ANO — TURMA 8A — Nº 1
   Dados fictícios do "Estudante Exemplo"
   ========================================================= */

/* =========================================================
   CONFIGURAÇÃO FIXA DO ALUNO
   Turma e número de chamada não podem ser alterados pela página.
   ========================================================= */
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 1,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* =========================================================
   VARIÁVEL: é uma "caixinha" onde guardamos um valor.
   ARRAY: é uma lista ordenada de valores, entre [ ].
   OBJETO: é um conjunto de pares chave/valor, entre { }.
   ========================================================= */

// ARRAY de OBJETOS com os dados brutos de cada disciplina
const disciplinasPadrao = [
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

// Variável que guardará os dados em uso (API ou padrão)
let disciplinas = [];

// PIN fica somente em memória durante a sessão (nunca em localStorage)
let pinSessao = null;

// Controla o modo de edição
let modoEdicao = false;

/* =========================================================
   VARIÁVEIS DE INSTÂNCIA DOS GRÁFICOS
   ========================================================= */
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

/* =========================================================
   FUNÇÃO: é um bloco de código que faz uma tarefa.
   Recebe dados, processa e devolve um resultado.
   ========================================================= */

// Normaliza uma nota para a escala de 0 a 10 (DADOS ANTIGOS)
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
   VALIDAÇÃO DOS CAMPOS DE EDIÇÃO
   Regras diferentes das dos dados antigos.
   ========================================================= */

// Valida nota digitada pelo aluno no editor
// Aceita: 0 a 10, ponto ou vírgula decimal, ou vazio
// Vazio vira null. Valor inválido NÃO vira null nem zero.
function validarNotaEdicao(texto) {
  const limpo = texto.trim();

  // Vazio é permitido e vira null
  if (limpo === "") {
    return { valido: true, valor: null };
  }

  // Só aceita números com vírgula ou ponto decimal
  const convertido = limpo.replace(",", ".");
  const numero = Number(convertido);

  // Precisa ser número
  if (isNaN(numero)) {
    return { valido: false, valor: null };
  }

  // Precisa estar entre 0 e 10
  if (numero < 0 || numero > 10) {
    return { valido: false, valor: null };
  }

  return { valido: true, valor: numero };
}

// Valida faltas digitadas pelo aluno no editor
// Aceita somente inteiro >= 0. Vazio é inválido.
function validarFaltasEdicao(texto) {
  const limpo = texto.trim();

  if (limpo === "") {
    return { valido: false, valor: null };
  }

  // Só dígitos (inteiro positivo)
  if (!/^\d+$/.test(limpo)) {
    return { valido: false, valor: null };
  }

  const numero = Number(limpo);
  if (numero < 0) {
    return { valido: false, valor: null };
  }

  return { valido: true, valor: numero };
}

/* =========================================================
   IF: é uma estrutura condicional ("se... então").
   FOR EACH: percorre cada item de um array.
   DOM: é a representação da página HTML que o JS pode alterar.
   ========================================================= */

// Elementos do DOM
const corpoTabela = document.getElementById("corpo-tabela");
const areaCards = document.getElementById("cards");
const telaAcesso = document.getElementById("tela-acesso");
const conteudoBoletim = document.getElementById("conteudo-boletim");
const campoPin = document.getElementById("campo-pin");
const botaoEntrar = document.getElementById("botao-entrar");
const mensagemAcesso = document.getElementById("mensagem-acesso");
const botaoAlterar = document.getElementById("botao-alterar");
const botaoSalvar = document.getElementById("botao-salvar");
const botaoCancelar = document.getElementById("botao-cancelar");
const mensagemSalvar = document.getElementById("mensagem-salvar");

/* =========================================================
   RENDERIZAÇÃO — TABELA E CARDS
   Limpa antes de reconstruir para permitir várias atualizações.
   ========================================================= */

function renderizarTabela() {
  // Limpa a tabela antes de reconstruir
  corpoTabela.innerHTML = "";

  // FOR EACH: percorre cada disciplina do array
  disciplinas.forEach((item, indice) => {
    // Normaliza as três notas (dados antigos)
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Média e faltas
    const media = calcularMedia([n1, n2, n3]);
    const faltas = somarFaltas(item.faltas);
    const situacao = definirSituacao(media);

    // Cria a linha da tabela
    const linha = document.createElement("tr
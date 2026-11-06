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
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3:
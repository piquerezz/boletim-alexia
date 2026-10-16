/* =========================================================
   BOLETIM DIGITAL — 8º ANO
   Dados fictícios do "Estudante Exemplo"
   Agora com: acesso por PIN, carregamento pela API do professor,
   edição das notas e faltas, salvamento e recuperação.
   ========================================================= */

/* ---------------------------------------------------------
   CONFIGURAÇÃO FIXA DO ALUNO
   Turma e chamada não podem ser alteradas pela página.
   --------------------------------------------------------- */
const CONFIG_ALUNO = {
  turma: "8A",
  numeroChamada: 1,
  apiUrl: "https://boletim-api.profbt.com.br"
};

/* ---------------------------------------------------------
   VARIÁVEL: é uma "caixinha" onde guardamos um valor.
   ARRAY: é uma lista ordenada de valores, entre [ ].
   OBJETO: é um conjunto de pares chave/valor, entre { }.
   --------------------------------------------------------- */

// ARRAY de OBJETOS com os dados brutos de cada disciplina (dados fictícios locais)
const disciplinasLocais = [
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

// Estado atual do boletim (pode vir da API ou dos dados locais)
let disciplinas = [];

// Estado da edição
let modoEdicao = false;

// PIN mantido SOMENTE em memória durante a sessão
let pinSessao = "";

// Média mínima de referência
const MEDIA_MINIMA = 6.0;

/* =========================================================
   FUNÇÃO: é um bloco de código que faz uma tarefa.
   Recebe dados, processa e devolve um resultado.
   ========================================================= */

// Normaliza uma nota para a escala de 0 a 10 (DADOS ANTIGOS)
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero = typeof valor === "string" ? valor.replace(",", ".") : valor;
  numero = Number(numero);

  if (isNaN(numero)) {
    return null;
  }

  if (numero >= 0 && numero <= 10) {
    return numero;
  }

  if (numero > 10 && numero <= 100) {
    return numero / 10;
  }

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
   VALIDAÇÃO DOS CAMPOS DO EDITOR (REGRA DIFERENTE DOS DADOS ANTIGOS)
   ---------------------------------------------------------
   NOTAS digitadas pelo aluno:
   - aceitar número entre 0 e 10, com ponto ou vírgula, ou vazio
   - vazio vira null
   - NÃO aceitar 75, 82, 100, -1, 11, abc
   FALTAS digitadas pelo aluno:
   - aceitar somente inteiro >= 0
   - NÃO aceitar -1, 2,5, abc, vazio
   ========================================================= */

// Retorna { valido: true, valor: number|null } ou { valido: false }
function validarNotaDigitada(texto) {
  const limpo = String(texto).trim();

  // Vazio vira null
  if (limpo === "") {
    return { valido: true, valor: null };
  }

  // Aceita somente formato numérico simples com ponto ou vírgula
  if (!/^\d+([.,]\d+)?$/.test(limpo)) {
    return { valido: false };
  }

  const numero = Number(limpo.replace(",", "."));

  if (isNaN(numero) || numero < 0 || numero > 10) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

// Retorna { valido: true, valor: number } ou { valido: false }
function validarFaltaDigitada(texto) {
  const limpo = String(texto).trim();

  // Vazio é inválido para faltas
  if (limpo === "") {
    return { valido: false };
  }

  // Somente inteiro >= 0
  if (!/^\d+$/.test(limpo)) {
    return { valido: false };
  }

  const numero = Number(limpo);

  if (isNaN(numero) || numero < 0) {
    return { valido: false };
  }

  return { valido: true, valor: numero };
}

/* =========================================================
   DOM: é a representação da página HTML que o JS pode alterar.
   ========================================================= */

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
   FUNÇÕES DE RENDERIZAÇÃO
   ---------------------------------------------------------
   Foram feitas pequenas refatorações para permitir atualizar
   a tela várias vezes, sem duplicar cards ou linhas.
   ========================================================= */

// Limpa tabela e cards antes de reconstruir
function limparTela() {
  corpoTabela.innerHTML = "";
  areaCards.innerHTML = "";
}

// Cria um card
function criarCard(icone, titulo, valor, corValor = "") {
  const card = document.createElement("div");
  card.className = "card";

  const spanIcone = document.createElement("span");
  spanIcone.className = "card-icone";
  spanIcone.textContent = icone;

  const pTitulo = document.createElement("p");
  pTitulo.className = "card-titulo";
  pTitulo.textContent = titulo;

  const pValor = document.createElement("p");
  pValor.className = "card-valor " + corValor;
  pValor.textContent = valor;

  card.appendChild(spanIcone);
  card.appendChild(pTitulo);
  card.appendChild(pValor);

  return card;
}

// Cria uma célula simples com texto seguro (textContent)
function criarCelula(texto, classe) {
  const td = document.createElement("td");
  if (classe) td.className = classe;
  td.textContent = texto;
  return td;
}

// Cria a célula de nota (mostra "Ainda não lançada" quando null)
function criarCelulaNota(valor) {
  const td = document.createElement("td");
  if (valor === null) {
    const span = document.createElement("span");
    span.className = "nota-ausente";
    span.textContent = "Ainda não lançada";
    td.appendChild(span);
  } else {
    td.textContent = formatarNota(valor);
  }
  return td;
}

// Cria a célula de situação com classe de cor
function criarCelulaSituacao(situacao) {
  const td = document.createElement("td");
  const span = document.createElement("span");

  let classe = "indisponivel";
  if (situacao === "Bom desempenho") classe = "bom";
  if (situacao === "Atenção") classe = "atencao";

  span.className = "situacao " + classe;
  span.textContent = situacao;
  td.appendChild(span);
  return td;
}

// Cria um campo de edição de nota com validação
function criarCampoNota(valorOriginal, indiceDisciplina, indiceTrimestre) {
  const td = document.createElement("td");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "campo-edicao";
  input.inputMode = "decimal";
  input.dataset.tipo = "nota";
  input.dataset.disciplina = String(indiceDisciplina);
  input.dataset.trimestre = String(indiceTrimestre);

  // Valor inicial: se null, vazio. Se número, com vírgula
  if (valorOriginal === null || valorOriginal === undefined) {
    input.value = "";
  } else {
    input.value = String(valorOriginal).replace(".", ",");
  }

  const erro = document.createElement("span");
  erro.className = "erro-campo";
  erro.textContent = "";

  td.appendChild(input);
  td.appendChild(erro);
  return td;
}

// Cria um campo de edição de falta com validação
function criarCampoFalta(valorOriginal, indiceDisciplina, indiceTrimestre) {
  const td = document.createElement("td");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "campo-edicao";
  input.inputMode = "numeric";
  input.dataset.tipo = "falta";
  input.dataset.disciplina = String(indiceDisciplina);
  input.dataset.trimestre = String(indiceTrimestre);

  input.value = (valorOriginal === null || valorOriginal === undefined) ? "" : String(valorOriginal);

  const erro = document.createElement("span");
  erro.className = "erro-campo";
  erro.textContent = "";

  td.appendChild(input);
  td.appendChild(erro);
  return td;
}

// Cria a célula de faltas (modo leitura: mostra o total do trimestre)
function criarCelulaFaltaLeitura(valor) {
  const td = document.createElement("td");
  td.textContent = String(valor);
  return td;
}

// Renderiza cards e tabela a partir do array `disciplinas`
function renderizar() {
  limparTela();

  let somaMedias = 0;
  let totalMedias = 0;
  let totalFaltas = 0;
  let bonsDesempenhos = 0;
  let atencao = 0;

  // FOR EACH: percorre cada disciplina do array
  disciplinas.forEach((item, indice) => {
    // Normaliza as três notas (dados antigos)
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Faltas por trimestre
    const f1 = item.faltas[0] ?? 0;
    const f2 = item.faltas[1] ?? 0;
    const f3 = item.faltas[2] ?? 0;

    const media = calcularMedia([n1, n2, n3]);
    const faltas = somarFaltas([f1, f2, f3]);
    const situacao = definirSituacao(media);

    // Acumula totais gerais
    totalFaltas += faltas;
    if (media !== null) {
      somaMedias += media;
      totalMedias++;
    }
    if (situacao === "Bom desempenho") bonsDesempenhos++;
    if (situacao === "Atenção") atencao++;

    // Cria a linha
    const linha = document.createElement("tr");

    // Coluna: nome da disciplina (textContent = seguro)
    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;
    linha.appendChild(tdNome);

    // Colunas de notas
    if (modoEdicao) {
      linha.appendChild(criarCampoNota(n1, indice, 1));
      linha.appendChild(criarCampoNota(n2, indice, 2));
      linha.appendChild(criarCampoNota(n3, indice, 3));
    } else {
      linha.appendChild(criarCelulaNota(n1));
      linha.appendChild(criarCelulaNota(n2));
      linha.appendChild(criarCelulaNota(n3));
    }

    // Média
    const tdMedia = document.createElement("td");
    const strong = document.createElement("strong");
    strong.textContent = media === null ? "—" : formatarNota(media);
    tdMedia.appendChild(strong);
    linha.appendChild(tdMedia);

    // Faltas
    if (modoEdicao) {
      // Coluna de faltas do trimestre (mostrada em uma célula com os 3 campos)
      const tdFaltas = document.createElement("td");
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.gap = "4px";

      wrap.appendChild(criarCampoFalta(f1, indice, 1));
      wrap.appendChild(criarCampoFalta(f2, indice, 2));
      wrap.appendChild(criarCampoFalta(f3, indice, 3));

      tdFaltas.appendChild(wrap);
      linha.appendChild(tdFaltas);
    } else {
      linha.appendChild(criarCelulaFaltaLeitura(faltas));
    }

    // Situação
    linha.appendChild(criarCelulaSituacao(situacao));

    corpoTabela.appendChild(linha);
  });

  // Média geral
  const mediaGeral = totalMedias > 0 ? somaMedias / totalMedias : null;

  // Frequência FICTÍCIA/DEMONSTRATIVA (preservada)
  const frequenciaDemonstrativa = 92;

  areaCards.appendChild(criarCard("📊", "Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral), "turquesa"));
  areaCards.appendChild(criarCard("📉", "Total de faltas", String(totalFaltas)));
  areaCards.appendChild(criarCard("✅", "Bom desempenho", String(bonsDesempenhos), "turquesa"));
  areaCards.appendChild(criarCard("⚠️", "Precisam de atenção", String(atencao)));
  areaCards.appendChild(criarCard("📅", "Frequência", frequenciaDemonstrativa + "% — Frequência adequada"));
}

/* =========================================================
   ACESSO — ABRIR BOLETIM PELA API
   ========================================================= */

function mostrarMensagemAcesso(texto, tipo) {
  mensagemAcesso.textContent = texto;
  mensagemAcesso.className = "acesso-mensagem" + (tipo ? " " + tipo : "");
}

async function abrirBoletim() {
  const pinDigitado = campoPin.value.trim();

  if (pinDigitado === "") {
    mostrarMensagemAcesso("Digite seu PIN.", "erro");
    return;
  }

  botaoEntrar.disabled = true;
  mostrarMensagemAcesso("Conectando...", "info");

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/abrir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      mostrarMensagemAcesso("Turma, chamada ou PIN inválidos.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      mostrarMensagemAcesso("Muitas tentativas. Aguarde um minuto e tente novamente.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
      botaoEntrar.disabled = false;
      return;
    }

    const resultado = await resposta.json();

    // PIN válido: guarda somente em memória
    pinSessao = pinDigitado;

    // Decide quais dados usar
    if (resultado && resultado.dados) {
      // DADOS DA API > DADOS LOCAIS
      disciplinas = resultado.dados.disciplinas || [];
    } else {
      // Sem dados salvos: usa os dados fictícios locais
      disciplinas = disciplinasLocais.map((d) => ({
        disciplina: d.disciplina,
        tri1: d.tri1,
        tri2: d.tri2,
        tri3: d.tri3,
        faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
      }));
    }

    // Limpa o campo do PIN após login bem-sucedido
    campoPin.value = "";
    mensagemAcesso.textContent = "";

    // Mostra o boletim
    telaAcesso.classList.add("oculto");
    conteudoBoletim.classList.remove("oculto");

    modoEdicao = false;
    renderizar();
  } catch (erro) {
    mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
    botaoEntrar.disabled = false;
  }
}

botaoEntrar.addEventListener("click", abrirBoletim);
campoPin.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") abrirBoletim();
});

/* =========================================================
   EDIÇÃO — ALTERAR / SALVAR / CANCELAR
   ========================================================= */

function entrarModoEdicao() {
  modoEdicao = true;
  mensagemSalvar.textContent = "";
  mensagemSalvar.className = "mensagem-salvar";
  botaoAlterar.classList.add("oculto");
  botaoSalvar.classList.remove("oculto");
  botaoCancelar.classList.remove("oculto");
  renderizar();
}

function sairModoEdicao() {
  modoEdicao = false;
  botaoAlterar.classList.remove("oculto");
  botaoSalvar.classList.add("oculto");
  botaoCancelar.classList.add("oculto");
}

function cancelarEdicao() {
  sairModoEdicao();
  mensagemSalvar.textContent = "Edição cancelada.";
  mensagemSalvar.className = "mensagem-salvar info";
  renderizar();
}

// Lê os campos da tabela, valida e devolve os dados novos
// Retorna { ok: true, dados: [...] } ou { ok: false, erros: quantidade }
function coletarDadosEditados() {
  const inputs = corpoTabela.querySelectorAll("input.campo-edicao");

  // Zera erros visuais
  inputs.forEach((inp) => {
    inp.classList.remove("invalido");
    const erro = inp.parentElement.querySelector(".erro-campo");
    if (erro) erro.textContent = "";
  });

  // Cópia profunda do estado atual
  const novosDados = disciplinas.map((d) => ({
    disciplina: d.disciplina,
    tri1: d.tri1,
    tri2: d.tri2,
    tri3: d.tri3,
    faltas: [d.faltas[0], d.faltas[1], d.faltas[2]]
  }));

  let quantidadeErros = 0;

  inputs.forEach((inp) => {
    const indice = Number(inp.dataset.disciplina);
    const trimestre = Number(inp.dataset.trimestre);
    const tipo = inp.dataset.tipo;

    if (tipo === "nota") {
      const resultado = validarNotaDigitada(inp.value);
      if (!resultado.valido) {
        inp.classList.add("invalido");
        const erro = inp.parentElement.querySelector(".erro-campo");
        if (erro) erro.textContent = "Nota inválida";
        quantidadeErros++;
      } else {
        if (trimestre === 1) novosDados[indice].tri1 = resultado.valor;
        if (trimestre === 2) novosDados[indice].tri2 = resultado.valor;
        if (trimestre === 3) novosDados[indice].tri3 = resultado.valor;
      }
    }

    if (tipo === "falta") {
      const resultado = validarFaltaDigitada(inp.value);
      if (!resultado.valido) {
        inp.classList.add("invalido");
        const erro = inp.parentElement.querySelector(".erro-campo");
        if (erro) erro.textContent = "Falta inválida";
        quantidadeErros++;
      } else {
        novosDados[indice].faltas[trimestre - 1] = resultado.valor;
      }
    }
  });

  if (quantidadeErros > 0) {
    return { ok: false, erros: quantidadeErros };
  }

  return { ok: true, dados: novosDados };
}

async function salvarAlteracoes() {
  const coleta = coletarDadosEditados();

  if (!coleta.ok) {
    mensagemSalvar.textContent = "Corrija os campos inválidos antes de salvar.";
    mensagemSalvar.className = "mensagem-salvar erro";
    return;
  }

  botaoSalvar.disabled = true;
  botaoCancelar.disabled = true;
  mensagemSalvar.textContent = "Salvando...";
  mensagemSalvar.className = "mensagem-salvar info";

  try {
    const resposta = await fetch(CONFIG_ALUNO.apiUrl + "/api/v1/boletins/salvar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: { disciplinas: coleta.dados }
      })
    });

    if (!resposta.ok) {
      // Não apaga o que o aluno digitou, não fecha a edição
      mensagemSalvar.textContent = "Não foi possível salvar. Tente novamente.";
      mensagemSalvar.className = "mensagem-salvar erro";
      botaoSalvar.disabled = false;
      botaoCancelar.disabled = false;
      return;
    }

    // Sucesso: atualiza o estado e re-renderiza
    disciplinas = coleta.dados;
    sairModoEdicao();
    renderizar();

    mensagemSalvar.textContent = "Dados salvos com sucesso.";
    mensagemSalvar.className = "mensagem-salvar sucesso";
    botaoSalvar.disabled = false;
    botaoCancelar.disabled = false;
  } catch (erro) {
    // Falha de rede: mantém os campos para nova tentativa
    mensagemSalvar.textContent = "Não foi possível salvar. Tente novamente.";
    mensagemSalvar.className = "mensagem-salvar erro";
    botaoSalvar.disabled = false;
    botaoCancelar.disabled = false;
  }
}

botaoAlterar.addEventListener("click", entrarModoEdicao);
botaoCancelar.addEventListener("click", cancelarEdicao);
botaoSalvar.addEventListener("click", salvarAlteracoes);
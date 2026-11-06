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
    const linha = document.createElement("tr");

    // Classe de cor para a situação
    let classeSituacao = "indisponivel";
    if (situacao === "Bom desempenho") classeSituacao = "bom";
    if (situacao === "Atenção") classeSituacao = "atencao";

    // Célula do nome da disciplina (nunca editável)
    const celulaDisciplina = document.createElement("td");
    celulaDisciplina.textContent = item.disciplina;

    // Células das notas e faltas
    const celulaTri1 = document.createElement("td");
    const celulaTri2 = document.createElement("td");
    const celulaTri3 = document.createElement("td");
    const celulaMedia = document.createElement("td");
    const celulaFaltas = document.createElement("td");
    const celulaSituacao = document.createElement("td");

    if (modoEdicao) {
      // Campos de edição para notas
      celulaTri1.appendChild(criarCampoNota(item, "tri1", n1));
      celulaTri2.appendChild(criarCampoNota(item, "tri2", n2));
      celulaTri3.appendChild(criarCampoNota(item, "tri3", n3));

      // Média é recalculada ao vivo
      celulaMedia.innerHTML = `<strong>${media === null ? "—" : formatarNota(media)}</strong>`;

      // Campos de edição para faltas
      celulaFaltas.appendChild(criarCampoFalta(item, 0, item.faltas[0]));
      celulaFaltas.appendChild(criarCampoFalta(item, 1, item.faltas[1]));
      celulaFaltas.appendChild(criarCampoFalta(item, 2, item.faltas[2]));
    } else {
      // Modo leitura normal
      celulaTri1.innerHTML = n1 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n1);
      celulaTri2.innerHTML = n2 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n2);
      celulaTri3.innerHTML = n3 === null ? '<span class="nota-ausente">Ainda não lançada</span>' : formatarNota(n3);
      celulaMedia.innerHTML = `<strong>${media === null ? "—" : formatarNota(media)}</strong>`;
      celulaFaltas.textContent = faltas;
    }

    // Situação
    celulaSituacao.innerHTML = `<span class="situacao ${classeSituacao}">${situacao}</span>`;

    // Monta a linha na ordem correta
    linha.appendChild(celulaDisciplina);
    linha.appendChild(celulaTri1);
    linha.appendChild(celulaTri2);
    linha.appendChild(celulaTri3);
    linha.appendChild(celulaMedia);
    linha.appendChild(celulaFaltas);
    linha.appendChild(celulaSituacao);

    corpoTabela.appendChild(linha);
  });
}

// Cria um campo de edição para uma nota
function criarCampoNota(item, chave, valorAtual) {
  const wrapper = document.createElement("div");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "campo-edicao";
  input.dataset.indice = String(disciplinas.indexOf(item));
  input.dataset.tipo = "nota";
  input.dataset.chave = chave;
  input.value = valorAtual === null ? "" : formatarNota(valorAtual);
  input.setAttribute("inputmode", "decimal");

  // Validação ao vivo
  input.addEventListener("input", () => {
    const resultado = validarNotaEdicao(input.value);
    if (resultado.valido) {
      input.classList.remove("invalido");
      const erroAntigo = wrapper.querySelector(".erro-campo");
      if (erroAntigo) erroAntigo.remove();
    } else {
      input.classList.add("invalido");
      if (!wrapper.querySelector(".erro-campo")) {
        const erro = document.createElement("span");
        erro.className = "erro-campo";
        erro.textContent = "Nota inválida (0 a 10)";
        wrapper.appendChild(erro);
      }
    }
    atualizarTotaisTela();
  });

  wrapper.appendChild(input);
  return wrapper;
}

// Cria um campo de edição para faltas
function criarCampoFalta(item, indiceTrimestre, valorAtual) {
  const wrapper = document.createElement("div");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "campo-edicao";
  input.dataset.indice = String(disciplinas.indexOf(item));
  input.dataset.tipo = "falta";
  input.dataset.trimestre = String(indiceTrimestre);
  input.value = String(valorAtual);
  input.setAttribute("inputmode", "numeric");

  // Validação ao vivo
  input.addEventListener("input", () => {
    const resultado = validarFaltasEdicao(input.value);
    if (resultado.valido) {
      input.classList.remove("invalido");
      const erroAntigo = wrapper.querySelector(".erro-campo");
      if (erroAntigo) erroAntigo.remove();
    } else {
      input.classList.add("invalido");
      if (!wrapper.querySelector(".erro-campo")) {
        const erro = document.createElement("span");
        erro.className = "erro-campo";
        erro.textContent = "Falta inválida";
        wrapper.appendChild(erro);
      }
    }
    atualizarTotaisTela();
  });

  wrapper.appendChild(input);
  return wrapper;
}

// Recalcula totais apenas para exibição durante a edição
function atualizarTotaisTela() {
  // Apenas dispara uma re-renderização leve dos cards
  // sem perder os valores digitados.
  renderizarCards();
}

function renderizarCards() {
  // Limpa os cards antes de reconstruir
  areaCards.innerHTML = "";

  let somaMedias = 0;
  let totalMedias = 0;
  let totalFaltas = 0;
  let bonsDesempenhos = 0;
  let atencao = 0;

  disciplinas.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia([n1, n2, n3]);
    const faltas = somarFaltas(item.faltas);
    const situacao = definirSituacao(media);

    totalFaltas += faltas;
    if (media !== null) {
      somaMedias += media;
      totalMedias++;
    }
    if (situacao === "Bom desempenho") bonsDesempenhos++;
    if (situacao === "Atenção") atencao++;
  });

  const mediaGeral = totalMedias > 0 ? somaMedias / totalMedias : null;

  // Frequência FICTÍCIA/DEMONSTRATIVA
  // ATENÇÃO: este percentual é apenas demonstrativo.
  const frequenciaDemonstrativa = 92;

  areaCards.appendChild(criarCard("📊", "Média geral", mediaGeral === null ? "—" : formatarNota(mediaGeral), "turquesa"));
  areaCards.appendChild(criarCard("📉", "Total de faltas", totalFaltas));
  areaCards.appendChild(criarCard("✅", "Bom desempenho", bonsDesempenhos, "turquesa"));
  areaCards.appendChild(criarCard("⚠️", "Precisam de atenção", atencao));
  areaCards.appendChild(criarCard("📅", "Frequência", frequenciaDemonstrativa + "% — Frequência adequada"));
}

// Função para criar um card
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

/* =========================================================
   TELA DE ACESSO — PIN
   ========================================================= */

function mostrarMensagemAcesso(texto, tipo) {
  mensagemAcesso.textContent = texto;
  mensagemAcesso.className = "acesso-mensagem" + (tipo ? " " + tipo : "");
}

async function entrar() {
  const pin = campoPin.value.trim();

  if (pin === "") {
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
        pin: pin
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

    const json = await resposta.json();

    // Se a API retornou dados, eles têm prioridade sobre os dados locais
    if (json && json.dados && Array.isArray(json.dados.disciplinas)) {
      disciplinas = json.dados.disciplinas;
    } else {
      // Sem dados salvos: usa as disciplinas e dados fictícios do projeto
      disciplinas = JSON.parse(JSON.stringify(disciplinasPadrao));
    }

    // Guarda o PIN somente em memória durante a sessão
    pinSessao = pin;

    // Limpa o campo do PIN após o login
    campoPin.value = "";

    // Mostra o boletim
    telaAcesso.classList.add("oculto");
    conteudoBoletim.classList.remove("oculto");

    renderizarTabela();
    renderizarCards();
    atualizarGraficos();
  } catch (erro) {
    mostrarMensagemAcesso("Não foi possível conectar ao servidor. Tente novamente.", "erro");
    botaoEntrar.disabled = false;
  }
}

botaoEntrar.addEventListener("click", entrar);
campoPin.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") {
    entrar();
  }
});

/* =========================================================
   EDIÇÃO E SALVAMENTO
   ========================================================= */

function ativarEdicao() {
  modoEdicao = true;
  botaoAlterar.classList.add("oculto");
  botaoSalvar.classList.remove("oculto");
  botaoCancelar.classList.remove("oculto");
  mensagemSalvar.textContent = "";
  mensagemSalvar.className = "mensagem-salvar";
  renderizarTabela();
}

function cancelarEdicao() {
  modoEdicao = false;
  botaoAlterar.classList.remove("oculto");
  botaoSalvar.classList.add("oculto");
  botaoCancelar.classList.add("oculto");
  mensagemSalvar.textContent = "";
  mensagemSalvar.className = "mensagem-salvar";

  // Recarrega os dados originais em memória
  // (descarta alterações não salvas dos inputs)
  renderizarTabela();
  renderizarCards();
  atualizarGraficos();
}

// Lê os campos de edição e devolve os dados atualizados
// Retorna null se houver algum campo inválido
function coletarDadosEditados() {
  const novosDados = JSON.parse(JSON.stringify(disciplinas));
  const campos = corpoTabela.querySelectorAll(".campo-edicao");
  let tudoValido = true;

  campos.forEach((input) => {
    const indice = Number(input.dataset.indice);
    const tipo = input.dataset.tipo;

    if (tipo === "nota") {
      const chave = input.dataset.chave;
      const resultado = validarNotaEdicao(input.value);
      if (!resultado.valido) {
        input.classList.add("invalido");
        tudoValido = false;
      } else {
        novosDados[indice][chave] = resultado.valor;
      }
    } else if (tipo === "falta") {
      const trimestre = Number(input.dataset.trimestre);
      const resultado = validarFaltasEdicao(input.value);
      if (!resultado.valido) {
        input.classList.add("invalido");
        tudoValido = false;
      } else {
        novosDados[indice].faltas[trimestre] = resultado.valor;
      }
    }
  });

  if (!tudoValido) return null;
  return novosDados;
}

async function salvarAlteracoes() {
  const dadosEditados = coletarDadosEditados();

  if (dadosEditados === null) {
    mensagemSalvar.textContent = "Existem campos inválidos. Corrija antes de salvar.";
    mensagemSalvar.className = "mensagem-salvar erro";
    return;
  }

  botaoSalvar.disabled = true;
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
        dados: {
          disciplinas: dadosEditados
        }
      })
    });

    if (resposta.status === 401) {
      mensagemSalvar.textContent = "Sessão inválida. Entre novamente.";
      mensagemSalvar.className = "mensagem-salvar erro";
      botaoSalvar.disabled = false;
      return;
    }

    if (resposta.status === 429) {
      mensagemSalvar.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      mensagemSalvar.className = "mensagem-salvar erro";
      botaoSalvar.disabled = false;
      return;
    }

    if (!resposta.ok) {
      mensagemSalvar.textContent = "Não foi possível salvar. Tente novamente.";
      mensagemSalvar.className = "mensagem-salvar erro";
      botaoSalvar.disabled = false;
      return;
    }

    // Sucesso: atualiza os dados em memória
    disciplinas = dadosEditados;

    mensagemSalvar.textContent = "Dados salvos com sucesso.";
    mensagemSalvar.className = "mensagem-salvar sucesso";

    modoEdicao = false;
    botaoAlterar.classList.remove("oculto");
    botaoSalvar.classList.add("oculto");
    botaoCancelar.classList.add("oculto");

    renderizarTabela();
    renderizarCards();
    atualizarGraficos();
  } catch (erro) {
    // Mantém os campos para nova tentativa
    mensagemSalvar.textContent = "Não foi possível salvar. Tente novamente.";
    mensagemSalvar.className = "mensagem-salvar erro";
  }

  botaoSalvar.disabled = false;
}

botaoAlterar.addEventListener("click", ativarEdicao);
botaoCancelar.addEventListener("click", cancelarEdicao);
botaoSalvar.addEventListener("click", salvarAlteracoes);

/* =========================================================
   GRÁFICOS — CAMADA SOMENTE LEITURA
   Estes gráficos NÃO alteram disciplinas, notas ou faltas.
   Utilizam apenas o estado já carregado na variável `disciplinas`.
   ========================================================= */

// Referência interna de risco (NÃO exibir na interface)
const REFERENCIA_INTERNA_FALTAS = 350;

// Instâncias do Chart.js (permitem destruir antes de recriar)
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

// Cores do tema do projeto
const COR_TURQUESA = "#14B8A6";
const COR_AZUL_MARINHO = "#1E3A8A";
const COR_TEXTO = "#1F2937";
const COR_TEXTO_SUAVE = "#64748B";
const COR_GRADE = "rgba(100, 116, 139, 0.15)";

// Elementos do DOM dos gráficos
const canvasMedias = document.getElementById("graficoMediasDisciplinas");
const canvasEvolucao = document.getElementById("graficoEvolucaoTrimestres");
const canvasFaltas = document.getElementById("graficoFaltasTrimestres");
const estadoFaltas = document.getElementById("estadoFaltas");
const cardGraficoFaltas = document.getElementById("cardGraficoFaltas");

// Calcula a média de uma disciplina usando as funções existentes
function calcularMediaDisciplina(item) {
  return calcularMedia([
    normalizarNota(item.tri1),
    normalizarNota(item.tri2),
    normalizarNota(item.tri3)
  ]);
}

// GRÁFICO 1 — Média por disciplina (barras horizontais)
function atualizarGraficoMedias() {
  if (!canvasMedias) return;

  // Cópia de leitura — não altera o array original
  const copia = disciplinas.map((item) => ({
    nome: item.disciplina,
    media: calcularMediaDisciplina(item)
  }));

  // Ordena somente a cópia, por média decrescente (null vai para o fim)
  const ordenada = [...copia].sort((a, b) => {
    if (a.media === null && b.media === null) return 0;
    if (a.media === null) return 1;
    if (b.media === null) return -1;
    return b.media - a.media;
  });

  const labels = ordenada.map((d) => d.nome);
  const valores = ordenada.map((d) => (d.media === null ? null : d.media));

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  graficoMedias = new Chart(canvasMedias, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Média",
          data: valores,
          backgroundColor: COR_TURQUESA,
          borderRadius: 4,
          borderSkipped: false
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: COR_AZUL_MARINHO,
          titleColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
          callbacks: {
            label: (ctx) => {
              const valor = ctx.parsed.x;
              if (valor === null || valor === undefined) return "Sem nota";
              return "Média: " + valor.toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: COR_TEXTO_SUAVE },
          grid: { color: COR_GRADE }
        },
        y: {
          ticks: {
            color: COR_TEXTO,
            font: { size: 11 }
          },
          grid: { display: false }
        }
      }
    }
  });
}

// GRÁFICO 2 — Evolução da média geral (linha)
function atualizarGraficoEvolucao() {
  if (!canvasEvolucao) return;

  const trimestres = ["tri1", "tri2", "tri3"];
  const mediasPorTrimestre = trimestres.map((chave) => {
    const validas = disciplinas
      .map((item) => normalizarNota(item[chave]))
      .filter((n) => n !== null);

    if (validas.length === 0) return null;

    const soma = validas.reduce((acc, n) => acc + n, 0);
    return soma / validas.length;
  });

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  graficoEvolucao = new Chart(canvasEvolucao, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [
        {
          label: "Média geral",
          data: mediasPorTrimestre,
          borderColor: COR_AZUL_MARINHO,
          backgroundColor: "rgba(30, 58, 138, 0.12)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: COR_TURQUESA,
          pointBorderColor: COR_AZUL_MARINHO,
          pointRadius: 5,
          pointHoverRadius: 7,
          spanGaps: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: COR_AZUL_MARINHO,
          titleColor: "#FFFFFF",
          bodyColor: "#FFFFFF",
          callbacks: {
            label: (ctx) => {
              const valor = ctx.parsed.y;
              if (valor === null || valor === undefined) return "Sem notas";
              return "Média: " + valor.toFixed(1).replace(".", ",");
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: COR_TEXTO_SUAVE },
          grid: { color: COR_GRADE }
        },
        x: {
          ticks: { color: COR_TEXTO },
          grid: { display: false }
        }
      }
    }
  });
}

// GRÁFICO 3 — Faltas por trimestre (barras verticais)
function atualizarGraficoFaltas() {
  if (!canvasFaltas) return;

  let faltasTri1 = 0;
  let faltasTri2 = 0;
  let faltasTri3 = 0;

  disciplinas.forEach((item) => {
    if (Array.isArray(item.faltas)) {
      faltasTri1 += Number(item.faltas[0]) || 0;
      faltasTri2 += Number(item.faltas[1]) || 0;
      faltasTri3 += Number(item.faltas[2]) || 0;
    }
  });

  // Total acumulado interno (apenas para avaliar risco — NÃO exibir)
  const totalInterno = faltasTri1 + faltasTri2 + faltasTri3;

  // Atualiza badge e destaque do card
  if (estadoFaltas && cardGraficoFaltas) {
    if (totalInterno >= REFERENCIA_INTERNA_FALTAS) {
      estadoFaltas.classList.remove("oculto");
      cardGraficoFaltas.classList.add("perigo");
    } else {
      estadoFaltas.classList.add("oculto");
      cardGraficoFaltas.classList.remove("perigo");
    }
  }

  if (graficoFaltas) {
    graficoFaltas.d
/* ====== Reset básico ====== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ====== Variáveis de cor ====== */
:root {
  --turquesa: #14B8A6;
  --azul-marinho: #1E3A8A;
  --fundo: #F1F5F9;
  --branco: #FFFFFF;
  --cinza-claro: #E2E8F0;
  --texto: #1F2937;
  --texto-suave: #64748B;
  --verde-claro: #DCFCE7;
  --verde-texto: #166534;
  --amarelo-claro: #FEF9C3;
  --amarelo-texto: #854D0E;
  --vermelho-claro: #FEE2E2;
  --vermelho-texto: #991B1B;
}

/* ====== Corpo da página ====== */
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: var(--fundo);
  color: var(--texto);
  line-height: 1.5;
}

/* ====== Cabeçalho ====== */
.cabecalho {
  background: linear-gradient(135deg, var(--turquesa), var(--azul-marinho));
  color: var(--branco);
  text-align: center;
  padding: 32px 16px;
}

.cabecalho h1 {
  font-size: 2rem;
  margin-bottom: 4px;
}

.subtitulo {
  font-size: 1rem;
  opacity: 0.95;
}

/* ====== Conteúdo principal ====== */
.conteudo {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* ====== Área dos cards ====== */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.card {
  background-color: var(--branco);
  border-radius: 12px;
  padding: 18px 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

/* Barrinha colorida no topo do card */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: var(--turquesa);
}

/* Cards alternados: turquesa e azul marinho */
.card:nth-child(even)::before {
  background-color: var(--azul-marinho);
}

.card-icone {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 6px;
}

.card-titulo {
  font-size: 0.85rem;
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.card-valor {
  font-size: 1.7rem;
  font-weight: bold;
  color: var(--azul-marinho);
}

.card-valor.turquesa {
  color: var(--turquesa);
}

/* ====== Tabela ====== */
.tabela-container h2 {
  margin-bottom: 12px;
  color: var(--azul-marinho);
}

.tabela-responsiva {
  overflow-x: auto; /* Permite rolar horizontalmente no celular */
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--branco);
  min-width: 700px; /* Garante que não fique apertado demais */
}

/* Cabeçalho da tabela */
thead th {
  background-color: var(--turquesa);
  color: var(--branco);
  padding: 12px 10px;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Linhas zebradas */
tbody tr:nth-child(odd) {
  background-color: var(--branco);
}

tbody tr:nth-child(even) {
  background-color: var(--cinza-claro);
}

tbody td {
  padding: 10px;
  font-size: 0.9rem;
  border-bottom: 1px solid #EDF2F7;
  white-space: nowrap;
}

/* Coluna de situação com cores */
.situacao {
  font-weight: 600;
  border-radius: 6px;
  padding: 4px 8px;
  display: inline-block;
  font-size: 0.85rem;
}

.situacao.bom {
  background-color: var(--verde-claro);
  color: var(--verde-texto);
}

.situacao.atencao {
  background-color: var(--amarelo-claro);
  color: var(--amarelo-texto);
}

.situacao.indisponivel {
  background-color: var(--cinza-claro);
  color: var(--texto-suave);
}

/* Nota ausente */
.nota-ausente {
  color: var(--texto-suave);
  font-style: italic;
}

/* ====== Rodapé ====== */
.rodape {
  text-align: center;
  padding: 20px 16px;
  font-size: 0.85rem;
  color: var(--texto-suave);
}

/* ====== Ajustes para celular ====== */
@media (max-width: 600px) {
  .cabecalho h1 {
    font-size: 1.5rem;
  }

  .card-valor {
    font-size: 1.4rem;
  }

  .conteudo {
    padding: 16px 10px;
  }
}

/* =========================================================
   ESTILOS ADICIONADOS — TELA DE ACESSO, EDIÇÃO E AÇÕES
   ========================================================= */

/* Esconde elementos */
.oculto {
  display: none !important;
}

/* Tela de acesso por PIN */
.tela-acesso {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--turquesa), var(--azul-marinho));
  padding: 16px;
}

.acesso-caixa {
  background-color: var(--branco);
  border-radius: 16px;
  padding: 32px 28px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.acesso-caixa h1 {
  color: var(--azul-marinho);
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.acesso-serie {
  font-size: 1rem;
  font-weight: 600;
  color: var(--turquesa);
}

.acesso-chamada {
  font-size: 0.9rem;
  color: var(--texto-suave);
  margin-bottom: 20px;
}

.acesso-label {
  display: block;
  text-align: left;
  font-size: 0.85rem;
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.acesso-input {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  text-align: center;
  letter-spacing: 4px;
  border: 2px solid var(--cinza-claro);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.acesso-input:focus {
  border-color: var(--turquesa);
}

.acesso-botao {
  width: 100%;
  margin-top: 14px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--branco);
  background: linear-gradient(135deg, var(--turquesa), var(--azul-marinho));
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.acesso-botao:hover {
  opacity: 0.9;
}

.acesso-botao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.acesso-mensagem {
  margin-top: 14px;
  font-size: 0.9rem;
  min-height: 1.2em;
}

.acesso-mensagem.erro {
  color: var(--vermelho-texto);
}

.acesso-mensagem.info {
  color: var(--texto-suave);
}

/* Barra de ações (alterar / salvar / cancelar) */
.barra-acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.botao-acao {
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.botao-acao:hover {
  opacity: 0.9;
}

.botao-acao:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

#botao-alterar {
  background-color: var(--azul-marinho);
  color: var(--branco);
}

.botao-salvar {
  background-color: var(--turquesa);
  color: var(--branco);
}

.botao-cancelar {
  background-color: var(--cinza-claro);
  color: var(--texto);
}

.mensagem-salvar {
  font-size: 0.9rem;
  min-height: 1.2em;
}

.mensagem-salvar.sucesso {
  color: var(--verde-texto);
}

.mensagem-salvar.erro {
  color: var(--vermelho-texto);
}

.mensagem-salvar.info {
  color: var(--texto-suave);
}

/* Campos de edição dentro da tabela */
.campo-edicao {
  width: 70px;
  padding: 6px;
  font-size: 0.9rem;
  text-align: center;
  border: 2px solid var(--cinza-claro);
  border-radius: 6px;
  outline: none;
}

.campo-edicao:focus {
  border-color: var(--turquesa);
}

.campo-edicao.invalido {
  border-color: #DC2626;
  background-color: var(--vermelho-claro);
}

/* Mensagens de erro abaixo dos campos */
.erro-campo {
  display: block;
  font-size: 0.7rem;
  color: var(--vermelho-texto);
  margin-top: 2px;
}

/* =========================================================
   ESTILOS ADICIONADOS — ÁREA DOS GRÁFICOS
   ========================================================= */

/* Grid responsivo: 3 colunas no desktop, 2 no tablet, 1 no celular */
.area-graficos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 32px;
}

.grafico-card {
  background-color: var(--branco);
  border-radius: 12px;
  padding: 16px 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* Barrinha turquesa no topo, seguindo a identidade dos cards */
.grafico-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: var(--turquesa);
}

.grafico-cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.grafico-titulo {
  font-size: 1rem;
  color: var(--azul-marinho);
  margin-bottom: 12px;
  font-weight: 600;
}

.grafico-cabecalho .grafico-titulo {
  margin-bottom: 0;
}

/* Container do canvas */
.grafico-container {
  position: relative;
  width: 100%;
  height: 220px;
}

/* Card de média por disciplina precisa de mais altura (≈15 disciplinas) */
.grafico-container-alto {
  height: 420px;
}

/* Badge de Perigo */
.badge-perigo {
  display: inline-block;
  padding: 3px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vermelho-texto);
  background-color: var(--vermelho-claro);
  border-radius: 999px;
  border: 1px solid #FCA5A5;
}

/* Destaque do card quando a situação for crítica */
.grafico-card.perigo {
  border: 2px solid #DC2626;
  box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25);
}

.grafico-card.perigo::before {
  background-color: #DC2626;
}

/* =========================================================
   RESPONSIVIDADE DOS GRÁFICOS
   ========================================================= */

/* Tablet: 2 colunas, média por disciplina ocupa a primeira linha inteira */
@media (max-width: 900px) {
  .area-graficos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* O card de média por disciplina fica em largura total no tablet */
  .area-graficos > .grafico-card:first-child {
    grid-column: 1 / -1;
  }
}

/* Celular: 1 coluna */
@media (max-width: 600px) {
  .area-graficos {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .area-graficos > .grafico-card:first-child {
    grid-column: auto;
  }

  .grafico-container {
    height: 200px;
  }

  .grafico-container-alto {
    height: 460px;
  }

  .grafico-card {
    padding: 14px 12px 16px;
  }
}
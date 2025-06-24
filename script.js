// ===================== Variáveis globais =====================

const sections = document.querySelectorAll('.secao');
const navButtons = document.querySelectorAll('.nav-btn');

const form = document.getElementById('formNecessidade');
const listaNecessidades = document.getElementById('listaNecessidades');
const filtroBusca = document.getElementById('filtroBusca');
const filtroTipo = document.getElementById('filtroTipo');
const msgSucesso = document.querySelector('.msg-sucesso');

let necessidades = [];
// ===================== Função para alternar seções =====================

function trocaSecao(idAtiva) {
  sections.forEach(sec => {
    if (sec.id === idAtiva) {
      sec.classList.add('active');
      sec.setAttribute('aria-hidden', 'false');
      sec.setAttribute('tabindex', '0');
    } else {
      sec.classList.remove('active');
      sec.setAttribute('aria-hidden', 'true');
      sec.setAttribute('tabindex', '-1');
    }
  });

  navButtons.forEach(btn => {
    if (btn.getAttribute('aria-controls') === idAtiva) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      btn.setAttribute('tabindex', '0');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    }
  });

  if (idAtiva === 'visualizacao') {
    aplicaFiltro();
  }
}
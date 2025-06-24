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
// ===================== Criação dos cards =====================

function criaCard(necessidade) {
  const card = document.createElement('article');
  card.classList.add('card');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', Necessidade: ${necessidade.titulo});

  card.innerHTML = `
    <h3>${necessidade.titulo}</h3>
    <p><strong>Instituição:</strong> ${necessidade.nomeInstituicao}</p>
    <p><strong>Tipo:</strong> ${necessidade.tipoAjuda}</p>
    <p><strong>Descrição:</strong> ${necessidade.descricao}</p>
    <p><strong>Endereço:</strong> ${necessidade.rua}, Nº ${necessidade.numero}, ${necessidade.bairro}, ${necessidade.cidade} - ${necessidade.estado}, CEP: ${necessidade.cep}</p>
    <p><strong>Contato:</strong> ${necessidade.contato}</p>
  `;

  return card;
}

function renderizaLista(lista) {
  listaNecessidades.innerHTML = '';
  if (lista.length === 0) {
    listaNecessidades.innerHTML = <p aria-live="polite" style="text-align:center; color:#777;">Nenhuma necessidade encontrada.</p>;
    return;
  }
  lista.forEach(item => {
    const card = criaCard(item);
    listaNecessidades.appendChild(card);
  });
}
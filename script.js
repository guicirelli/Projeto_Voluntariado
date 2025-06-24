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
  card.setAttribute('aria-label', 'Necessidade: ${necessidade.titulo}');

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
    listaNecessidades.innerHTML = '<p aria-live="polite" style="text-align:center; color:#777;">Nenhuma necessidade encontrada.</p>';
    return;
  }
  lista.forEach(item => {
    const card = criaCard(item);
    listaNecessidades.appendChild(card);
  });
}
// ===================== Validação do formulário =====================

function validaFormulario(data) {
  const camposObrigatorios = [
    'nomeInstituicao', 'tipoAjuda', 'titulo',
    'descricao', 'cep', 'rua', 'bairro', 'cidade',
    'estado', 'numero', 'contato'
  ];

  for (const campo of camposObrigatorios) {
    if (!data[campo] || data[campo].trim() === '') {
      return { valido: false, campo };
    }
  }

  if (!/^\d{5}-?\d{3}$/.test(data.cep)) {
    return { valido: false, campo: 'cep' };
  }

  if (!/^[A-Za-z]{2}$/.test(data.estado)) {
    return { valido: false, campo: 'estado' };
  }

  if (!/^\d+$/.test(data.numero)) {
    return { valido: false, campo: 'numero' };
  }

  const tiposValidos = ['Educação', 'Saúde', 'Meio Ambiente', 'Doação de Alimentos', 'Doação de Roupas', 'Outros'];
  if (!tiposValidos.includes(data.tipoAjuda)) {
    return { valido: false, campo: 'tipoAjuda' };
  }
// Restringe o campo de número para aceitar apenas dígitos
const campoNumero = document.getElementById('numero');
campoNumero.addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '');
});
  return { valido: true };
  
}
// ===================== Limpar formulário =====================

function limparFormulario() {
  form.reset();
}
// ===================== Coletar dados do formulário =====================

function coletaDadosFormulario() {
  return {
    nomeInstituicao: form.nomeInstituicao.value.trim(),
    tipoAjuda: form.tipoAjuda.value,
    titulo: form.tituloNecessidade.value.trim(),
    descricao: form.descricao.value.trim(),
    cep: form.cep.value.trim(),
    rua: form.rua.value.trim(),
    bairro: form.bairro.value.trim(),
    cidade: form.cidade.value.trim(),
    estado: form.estado.value.trim().toUpperCase(),
    numero: form.numero.value.trim(),
    contato: form.contato.value.trim(),
  };
}
// ===================== Aplicar filtros =====================

function aplicaFiltro() {
  const textoBusca = filtroBusca.value.toLowerCase();
  const tipoFiltro = filtroTipo.value;

  let listaFiltrada = necessidades.filter(item => {
    const textoCompleto = `${item.titulo} ${item.descricao}`.toLowerCase();
    const buscaOk = textoBusca === '' || textoCompleto.includes(textoBusca);
    const tipoOk = tipoFiltro === '' || item.tipoAjuda === tipoFiltro;
    return buscaOk && tipoOk;
  });

  renderizaLista(listaFiltrada);
}
// ===================== Integração com ViaCEP =====================

function buscarEnderecoPorCEP(cep) {
  cep = cep.replace(/\D/g, '');
  if (cep.length !== 8) return;

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(dados => {
      if (dados.erro) {
        alert('CEP não encontrado.');
        return;
      }

      form.rua.value = dados.logradouro || '';
      form.bairro.value = dados.bairro || '';
      form.cidade.value = dados.localidade || '';
      form.estado.value = dados.uf || '';
    })
    .catch(() => {
      alert('Erro ao buscar endereço. Tente novamente.');
    });
}
// ===================== Eventos do sistema =====================

function inicializaEventos() {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trocaSecao(btn.getAttribute('aria-controls'));
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const dados = coletaDadosFormulario();
    const validacao = validaFormulario(dados);

    if (!validacao.valido) {
      alert(`Por favor, preencha corretamente o campo: ${validacao.campo}`);
      form[validacao.campo].focus();
      return;
    }

    necessidades.push(dados);

    msgSucesso.textContent = 'Necessidade cadastrada com sucesso!';
    msgSucesso.style.display = 'block';

    limparFormulario();
    trocaSecao('visualizacao');
    aplicaFiltro();

    setTimeout(() => {
      msgSucesso.style.display = 'none';
    }, 4000);
  });

  filtroBusca.addEventListener('input', aplicaFiltro);
  filtroTipo.addEventListener('change', aplicaFiltro);

  form.cep.addEventListener('blur', () => {
    const cep = form.cep.value.trim();
    if (/^\d{5}-?\d{3}$/.test(cep)) {
      buscarEnderecoPorCEP(cep);
    }
  });

  const campoNumero = document.getElementById('numero');
  campoNumero.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '');
  });
}
// ===================== Inicialização da aplicação =====================

function init() {
  trocaSecao('home');
  inicializaEventos();
}

init();
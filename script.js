let ultimoResultado = null;

// Ordem das colunas do histórico
const COLUNAS = [
  "medidorCasa2",
  "padraoConsumo",
  "padraoValor",
  "mes",
  "casa1Valor",
  "casa1Consumo",
  "casa2Valor",
  "casa2Consumo"
];

function lerNumero(id) {
  return parseFloat(document.getElementById(id).value.replace(',', '.'));
}

function formatar(numero) {
  return numero.toFixed(2).replace('.', ',');
}

function mostrarMensagem(texto) {
  document.getElementById("mensagem").innerText = texto;
}

function calcular() {
  const valorConta = lerNumero("valorConta");
  const consumoTotal = lerNumero("consumoTotal");
  const leituraAnterior = lerNumero("leituraAnterior");
  const leituraAtual = lerNumero("leituraAtual");

  document.getElementById("resultados").hidden = true;
  ultimoResultado = null;

  if (isNaN(valorConta) || isNaN(consumoTotal) || isNaN(leituraAnterior) || isNaN(leituraAtual)) {
    mostrarMensagem("Preencha todos os campos corretamente.");
    return;
  }

  const consumoCasa2 = leituraAtual - leituraAnterior;
  const consumoCasa1 = consumoTotal - consumoCasa2;

  if (consumoCasa2 < 0 || consumoCasa1 < 0) {
    mostrarMensagem("Erro: verifique as leituras e o consumo total.");
    return;
  }

  const precoPorKwh = valorConta / consumoTotal;
  const valorCasa1 = consumoCasa1 * precoPorKwh;
  const valorCasa2 = consumoCasa2 * precoPorKwh;

  mostrarMensagem("");
  document.getElementById("valorCasa1").innerText = `R$ ${formatar(valorCasa1)}`;
  document.getElementById("consumoCasa1").innerText = `${formatar(consumoCasa1)} kWh`;
  document.getElementById("valorCasa2").innerText = `R$ ${formatar(valorCasa2)}`;
  document.getElementById("consumoCasa2").innerText = `${formatar(consumoCasa2)} kWh`;
  document.getElementById("resultados").hidden = false;

  ultimoResultado = {
    medidorCasa2: `${String(leituraAnterior).replace('.', ',')} → ${String(leituraAtual).replace('.', ',')}`,
    padraoConsumo: `${formatar(consumoTotal)} kWh`,
    padraoValor: `R$ ${formatar(valorConta)}`,
    casa1Valor: `R$ ${formatar(valorCasa1)}`,
    casa1Consumo: `${formatar(consumoCasa1)} kWh`,
    casa2Valor: `R$ ${formatar(valorCasa2)}`,
    casa2Consumo: `${formatar(consumoCasa2)} kWh`
  };
}

function limpar() {
  ["valorConta", "consumoTotal", "leituraAnterior", "leituraAtual", "mesReferencia"].forEach(id => {
    document.getElementById(id).value = "";
  });
  mostrarMensagem("");
  document.getElementById("resultados").hidden = true;
  ultimoResultado = null;
}

function lerHistorico() {
  try {
    return JSON.parse(localStorage.getItem("historicoEnergia") || "[]");
  } catch (e) {
    return [];
  }
}

function adicionarHistorico() {
  const mes = document.getElementById("mesReferencia").value.trim();
  if (!mes || !ultimoResultado) {
    alert("Calcule primeiro e informe o mês.");
    return;
  }

  const dados = lerHistorico();
  dados.push({ mes, ...ultimoResultado });

  // Mantém apenas os 3 últimos meses
  while (dados.length > 3) {
    dados.shift();
  }

  localStorage.setItem("historicoEnergia", JSON.stringify(dados));
  carregarHistorico();
  limpar();
}

function carregarHistorico() {
  const dados = lerHistorico();
  const tabela = document.getElementById("tabelaHistorico").querySelector("tbody");
  tabela.innerHTML = "";
  dados.forEach(item => {
    const linha = document.createElement("tr");
    COLUNAS.forEach(chave => {
      const celula = document.createElement("td");
      celula.textContent = item[chave] || "—";
      linha.appendChild(celula);
    });
    tabela.appendChild(linha);
  });
  document.getElementById("historicoVazio").hidden = dados.length > 0;
}

// Carrega histórico ao abrir o app
window.onload = carregarHistorico;

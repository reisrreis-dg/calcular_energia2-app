let ultimoResultado = null;

function calcular() {
  const valorConta = parseFloat(document.getElementById("valorConta").value.replace(',', '.'));
  const consumoTotal = parseFloat(document.getElementById("consumoTotal").value.replace(',', '.'));
  const leituraAnterior = parseFloat(document.getElementById("leituraAnterior").value.replace(',', '.'));
  const leituraAtual = parseFloat(document.getElementById("leituraAtual").value.replace(',', '.'));

  if (isNaN(valorConta) || isNaN(consumoTotal) || isNaN(leituraAnterior) || isNaN(leituraAtual)) {
    document.getElementById("resultadoCasa1").innerText = "Preencha todos os campos corretamente.";
    document.getElementById("resultadoCasa2").innerText = "";
    return;
  }

  const consumoCasa2 = leituraAtual - leituraAnterior;
  const consumoCasa1 = consumoTotal - consumoCasa2;

  if (consumoCasa2 < 0 || consumoCasa1 < 0) {
    document.getElementById("resultadoCasa1").innerText = "Erro: verifique as leituras e o consumo total.";
    document.getElementById("resultadoCasa2").innerText = "";
    return;
  }

  const precoPorKwh = valorConta / consumoTotal;
  const valorCasa1 = consumoCasa1 * precoPorKwh;
  const valorCasa2 = consumoCasa2 * precoPorKwh;

  document.getElementById("resultadoCasa1").innerHTML =
    `<strong>Casa 1 deve pagar: R$ ${valorCasa1.toFixed(2).replace('.', ',')}</strong><br><small>Consumo: ${consumoCasa1.toFixed(2).replace('.', ',')} kWh</small>`;
  document.getElementById("resultadoCasa2").innerHTML =
    `<strong>Casa 2 deve pagar: R$ ${valorCasa2.toFixed(2).replace('.', ',')}</strong><br><small>Consumo: ${consumoCasa2.toFixed(2).replace('.', ',')} kWh</small>`;

  ultimoResultado = {
    valorCasa1: valorCasa1.toFixed(2).replace('.', ','),
    consumoCasa1: consumoCasa1.toFixed(2).replace('.', ','),
    valorCasa2: valorCasa2.toFixed(2).replace('.', ','),
    consumoCasa2: consumoCasa2.toFixed(2).replace('.', ',')
  };
}

function limpar() {
  document.getElementById("valorConta").value = "";
  document.getElementById("consumoTotal").value = "";
  document.getElementById("leituraAnterior").value = "";
  document.getElementById("leituraAtual").value = "";
  document.getElementById("mesReferencia").value = "";
  document.getElementById("resultadoCasa1").innerText = "";
  document.getElementById("resultadoCasa2").innerText = "";
  ultimoResultado = null;
}

function adicionarHistorico() {
  const mes = document.getElementById("mesReferencia").value;
  if (!mes || !ultimoResultado) {
    alert("Calcule primeiro e informe o mês.");
    return;
  }

  const tabela = document.getElementById("tabelaHistorico").querySelector("tbody");
  const linha = document.createElement("tr");

  linha.innerHTML = `
    <td>${mes}</td>
    <td>R$ ${ultimoResultado.valorCasa1}</td>
    <td>${ultimoResultado.consumoCasa1} kWh</td>
    <td>R$ ${ultimoResultado.valorCasa2}</td>
    <td>${ultimoResultado.consumoCasa2} kWh</td>
  `;

  tabela.appendChild(linha);

  // Mantém apenas os 3 últimos meses
  while (tabela.rows.length > 3) {
    tabela.deleteRow(0);
  }

  salvarHistorico();
  limpar();
}

function salvarHistorico() {
  const tabela = document.getElementById("tabelaHistorico").querySelector("tbody");
  const dados = [];
  for (let i = 0; i < tabela.rows.length; i++) {
    const cells = tabela.rows[i].cells;
    dados.push({
      mes: cells[0].innerText,
      casa1Valor: cells[1].innerText,
      casa1Consumo: cells[2].innerText,
      casa2Valor: cells[3].innerText,
      casa2Consumo: cells[4].innerText
    });
  }
  localStorage.setItem("historicoEnergia", JSON.stringify(dados));
}

function carregarHistorico() {
  const dados = JSON.parse(localStorage.getItem("historicoEnergia") || "[]");
  const tabela = document.getElementById("tabelaHistorico").querySelector("tbody");
  tabela.innerHTML = "";
  dados.forEach(item => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${item.mes}</td>
      <td>${item.casa1Valor}</td>
      <td>${item.casa1Consumo}</td>
      <td>${item.casa2Valor}</td>
      <td>${item.casa2Consumo}</td>
    `;
    tabela.appendChild(linha);
  });
}

// Carrega histórico ao abrir o app
window.onload = carregarHistorico;

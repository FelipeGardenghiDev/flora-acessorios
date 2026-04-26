import { API_URL } from './conexaoAPI.js';

let graficoVendas = null;

const MESES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

// =============================
// HELPER: calcular tempo relativo
// =============================
function calcularTempo(dataVenda) {
    const agora = new Date();
    const data = new Date(dataVenda);
    const diffMin = Math.floor((agora - data) / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 60) return `${diffMin}M ATRÁS`;
    if (diffHoras < 24) return `${diffHoras}H ATRÁS`;
    return `${diffDias}D ATRÁS`;
}

// =============================
// BUSCAR DADOS DO BACKEND
// =============================
async function carregarDadosDashboard() {
    try {
        const res = await fetch(`${API_URL}/carrega_dados.php?origem=dashboard&nocache=` + new Date().getTime());
        const dadosAPI = await res.json();

        console.log("DADOS DO DASH:", dadosAPI);

        const valores = new Array(12).fill(0);

        dadosAPI.forEach(item => {
            valores[item.MES - 1] = parseFloat(item.TOTAL);
        });

        return { meses: MESES, valores };

    } catch (erro) {
        console.error("Erro ao carregar dashboard:", erro);
        return { meses: MESES, valores: new Array(12).fill(0) };
    }
}

async function carregarVendasRecentes() {
    try {
        const res = await fetch(`${API_URL}/carrega_dados.php?origem=vendas_recentes&nocache=` + new Date().getTime());
        return await res.json();
    } catch (erro) {
        console.error('Erro ao carregar vendas recentes:', erro);
        return [];
    }
}

async function carregarVendasPorMes(mesSelecionado) {
    try {
        const mes = MESES.indexOf(mesSelecionado) + 1; // Converter 'JAN' -> 1, 'FEV' -> 2, etc.
        const res = await fetch(`${API_URL}/carrega_dados.php?origem=vendas_por_mes&mes=${mes}&nocache=` + new Date().getTime());
        return await res.json();
    } catch (erro) {
        console.error('Erro ao carregar vendas do mês:', erro);
        return [];
    }
}

// =============================
// CRIAR GRÁFICO
// =============================
async function inicializarGrafico() {
    const canvas = document.getElementById('vendasChart');
    if (!canvas) {
        console.error("Canvas para gráfico não encontrado!");
        return;
    }

    const ctx = canvas.getContext('2d');
    const dados = await carregarDadosDashboard();

    const corBarraNormal = '#CEC5B9'; 
    const corLinhasGrade = 'rgba(125, 118, 108, 0.2)'; 

    // Destruir gráfico anterior, se existir
    // (Só é necessário se for atualizar o gráfico dinamicamente, mas é uma boa prática)
    if (graficoVendas) graficoVendas.destroy();

    // Criar novo gráfico
    graficoVendas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dados.meses,
            datasets: [{
                label: 'Faturamento (R$)',
                data: dados.valores,
                backgroundColor: corBarraNormal,
                borderWidth: 0,
                borderRadius: 0
            }]
        },
        options: {
            onClick: exibirDetalhesMes,
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: corLinhasGrade, drawBorder: false },
                    ticks: { 
                        display: true,
                        callback: function(value) { return 'R$ ' + value; },
                        font: { family: "'Work Sans', sans-serif", size: 10 },
                        color: '#7D766C'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: "'Work Sans', sans-serif", size: 10, weight: 'bold' },
                        color: '#7D766C',
                        letterSpacing: 2
                    }
                }
            }
        }
    });
}

// =============================
// DETALHE DO MÊS (click na barra)
// =============================
async function exibirDetalhesMes(event, elements, chart) {
    if (elements.length === 0) return; 
    
    const index = elements[0].index;
    const mesClicado = chart.data.labels[index]; 

    const corBarraNormal = '#CEC5B9'; 
    const corBarraDestaque = '#665A44'; 

    const novasCores = chart.data.labels.map((_, i) => i === index ? corBarraDestaque : corBarraNormal);
    chart.data.datasets[0].backgroundColor = novasCores;
    chart.update();

    const container = document.getElementById('detalhes-mes');
    const titulo = document.getElementById('titulo-detalhes-mes');
    const cardsGrid = document.getElementById('cards-vendas');

    const vendasDoMes = await carregarVendasPorMes(mesClicado);

    titulo.textContent = `Detalhamento de vendas de ${mesClicado}`;
    cardsGrid.innerHTML = ''; 

    if (vendasDoMes.length === 0) {
        cardsGrid.innerHTML = '<p style="color: #7D766C; font-family: var(--font-texto);">Nenhuma venda registrada neste mês.</p>';
    } else {
        vendasDoMes.forEach(venda => {
            const card = document.createElement('div');
            card.className = 'venda-card';
            card.innerHTML = `
                <span><strong>Vendedor:</strong> ${venda.VENDEDOR}</span>
                <span><strong>Produto:</strong> ${venda.CATEGORIA} ${venda.NOME}</span> 
                <span><strong>Valor:</strong> R$ ${parseFloat(venda.VALOR).toFixed(2).replace('.', ',')}</span>
            `;
            cardsGrid.appendChild(card);
        });
    }

    container.style.display = 'block';
}

// =============================
// VENDAS RECENTES (sidebar)
// =============================
async function inicializarVendasRecentes() {
    const salesList = document.querySelector('.sales-list');
    if (!salesList) return;

    const vendas = await carregarVendasRecentes();
    salesList.innerHTML = '';

    if (vendas.length === 0) {
        salesList.innerHTML = '<p style="color: #7D766C; font-family: var(--font-texto); padding: 10px;">Nenhuma venda registrada.</p>';
        return;
    }

    vendas.forEach(venda => {
        // Pega as iniciais do vendedor p montar um avatar tipo MS pra Mariana Silva
        const iniciais = venda.VENDEDOR.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const tempo = calcularTempo(venda.DATA_VENDA);

        const divItem = document.createElement('div');
        divItem.className = 'sale-item';
        divItem.innerHTML = `
            <div class="avatar">${iniciais}</div>
            <div class="sale-info">
                <div class="sale-top">
                    <span class="customer-name">${venda.VENDEDOR}</span> 
                    <span class="time-ago">${tempo}</span>
                </div>
                <p class="product-name">Vendeu: <i>${venda.CATEGORIA} ${venda.NOME}</i></p>
                <p class="price">R$ ${parseFloat(venda.VALOR).toFixed(2).replace('.', ',')}</p>
            </div>
        `;
        salesList.appendChild(divItem);
    });
}

// =============================
// ATUALIZAR AUTOMÁTICO 
// =============================
/*function atualizarAutomatico() {
    setInterval(() => {
        console.log("Atualizando gráfico...");
        inicializarGrafico();
        inicializarVendasRecentes();
    }, 5000); // a cada 5 segundos
}*/

// =============================
// INICIAR
// =============================
document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafico();
    inicializarVendasRecentes();

    const btnAtualizar = document.getElementById('btn-atualizar');
    if (btnAtualizar) {
        btnAtualizar.addEventListener('click', () => {
            btnAtualizar.classList.add('girando');
            btnAtualizar.addEventListener('animationend', () => {
                btnAtualizar.classList.remove('girando');
            }, { once: true });

            inicializarGrafico();
            inicializarVendasRecentes();
        });
    }
});
import { API_URL } from './conexaoAPI.js';

function mostrarAlertaPersonalizado(mensagem, tipo = 'success') {
    const alertaExistente = document.querySelector('.custom-alert');
    if (alertaExistente) {
        alertaExistente.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `custom-alert ${tipo}`;
    alerta.textContent = mensagem;
    document.body.appendChild(alerta);

    requestAnimationFrame(() => {
        alerta.classList.add('show');
    });

    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => alerta.remove(), 250);
    }, 2800);
}

document.addEventListener('DOMContentLoaded', async () => {

    const selectVendedor = document.getElementById('nomeVendedor');
    const selectCodigo = document.getElementById('codigoProduto');
    const inputNomeDisplay = document.getElementById('nomeProdutoDisplay');
    const selectMesVenda = document.getElementById('mesVenda');
    const selectAnoVenda = document.getElementById('anoVenda');

    let produtos = [];

        // ==============================
        // CARREGAR MESES
        // ==============================
        const meses = [
            { valor: '01', nome: 'Janeiro' },
            { valor: '02', nome: 'Fevereiro' },
            { valor: '03', nome: 'Março' },
            { valor: '04', nome: 'Abril' },
            { valor: '05', nome: 'Maio' },
            { valor: '06', nome: 'Junho' },
            { valor: '07', nome: 'Julho' },
            { valor: '08', nome: 'Agosto' },
            { valor: '09', nome: 'Setembro' },
            { valor: '10', nome: 'Outubro' },
            { valor: '11', nome: 'Novembro' },
            { valor: '12', nome: 'Dezembro' }
        ];

        if (selectMesVenda) {
            const mesAtual = String(new Date().getMonth() + 1).padStart(2, '0');
            meses.forEach(mes => {
                const option = document.createElement('option');
                option.value = mes.valor;
                option.textContent = mes.nome;
                if (mes.valor === mesAtual) {
                    option.selected = true;
                }
                selectMesVenda.appendChild(option);
            });
        }

        // ==============================
        // CARREGAR ANOS
        // ==============================
        if (selectAnoVenda) {
            const anoAtual = new Date().getFullYear();
            for (let ano = 2025; ano <= anoAtual; ano++) {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                if (ano === anoAtual) {
                    option.selected = true;
                }
                selectAnoVenda.appendChild(option);
            }
        }

    // ==============================
    // CARREGAR VENDEDORES
    // ==============================
    if (selectVendedor) {
        const res = await fetch(`${API_URL}/carrega_dados.php?origem=vendedores`);
        const vendedores = await res.json();

        vendedores.forEach(v => {
            const option = document.createElement('option');
            option.value = v.NOME_COMPLETO;
            option.textContent = v.NOME_COMPLETO;
            selectVendedor.appendChild(option);
        });
    }

    // ==============================
    // CARREGAR PRODUTOS
    // ==============================
    if (selectCodigo) {
        const res = await fetch(`${API_URL}/carrega_dados.php?origem=produtos-form&nocache=` + new Date().getTime());
        produtos = await res.json();

        produtos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.ID;
            option.textContent = p.ID;
            selectCodigo.appendChild(option);
        });

        selectCodigo.addEventListener('change', () => {
            const prod = produtos.find(p => p.ID == selectCodigo.value);
            if (prod) {
                inputNomeDisplay.value = `${prod.CATEGORIA} - ${prod.DESCRICAO}`;
            }
        });
    }

    // ==============================
    // FORMULÁRIO DE VENDA
    // ==============================
    const formVenda = document.getElementById('vendaForm');

    if (formVenda) {
        formVenda.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id_prod = selectCodigo.value;
            const prod = produtos.find(p => p.ID == id_prod);

            const dados = {
                vendedor: selectVendedor.value,
                codigo_produto: id_prod,
                valor_venda: parseFloat(prod.VALOR),
                mes_venda: selectMesVenda.value,
                ano_venda: selectAnoVenda.value
            };

            console.log("Enviando:", dados); // DEBUG

            try {
                const res = await fetch(`${API_URL}/salvar_venda.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                const resposta = await res.json();
                console.log("Resposta:", resposta);

                if (resposta.status === "ok") {
                    mostrarAlertaPersonalizado('Venda registrada com sucesso!', 'success');
                } else {
                    mostrarAlertaPersonalizado('Erro: ' + (resposta.erro || 'Erro desconhecido'), 'error');
                }
            } catch (erro) {
                console.error('Erro ao registrar venda:', erro);
                mostrarAlertaPersonalizado('Não foi possível registrar a venda. Tente novamente.', 'error');
            }
        });
    }
});
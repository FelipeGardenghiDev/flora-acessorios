import { API_URL } from './conexaoAPI.js';

document.addEventListener('DOMContentLoaded', async () => {

    const selectVendedor = document.getElementById('nomeVendedor');
    const selectCodigo = document.getElementById('codigoProduto');
    const inputNomeDisplay = document.getElementById('nomeProdutoDisplay');
    const selectMesVenda = document.getElementById('mesVenda');

    let produtos = [];

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
                codigo_produto: parseInt(id_prod),
                valor_venda: parseFloat(prod.VALOR),
                mes_venda: selectMesVenda.value
            };

            console.log("Enviando:", dados); // DEBUG

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
                alert('Venda registrada com sucesso!');
                window.location.href = 'index.html';
            } else {
                alert('Erro: ' + (resposta.erro || 'Erro desconhecido'));
            }
        });
    }
});
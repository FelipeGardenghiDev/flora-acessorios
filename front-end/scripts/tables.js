import { API_URL } from './conexaoAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tabelaVendedores = document.getElementById('tabelaVendedores');
    const tabelaProdutos = document.getElementById('tabelaProdutos');

    // =============================================
    // CARREGAR DADOS DE VENDAS OU PRODUTOS
    // =============================================
    try {
        if (tabelaVendedores) {
            const res = await fetch(`${API_URL}/carrega_dados.php?origem=vendedores&nocache=` + new Date().getTime());
            const vendedores = await res.json();
            
            vendedores.forEach(v => {
                const row = tabelaVendedores.insertRow();
                // colocar o campo abaixo com text align center
                const cell = row.insertCell(0);
                cell.textContent = v.NOME_COMPLETO;
                cell.style.textAlign = "center";
            });
        } else if (tabelaProdutos) {
            const res = await fetch(`${API_URL}/carrega_dados.php?origem=produtos&nocache=` + new Date().getTime());
            const produtos = await res.json();

            produtos.forEach(p => {
                const row = tabelaProdutos.insertRow();
                // ccentralizar todos oos campos da tabela de produtos
                const cell = row.insertCell(0);
                cell.textContent = p.CATEGORIA;
                cell.style.textAlign = "center";
                const cell2 = row.insertCell(1);
                cell2.textContent = p.ID;
                cell2.style.textAlign = "center";
                const cell3 = row.insertCell(2);
                cell3.textContent = p.DESCRICAO;
                cell3.style.textAlign = "center";
                const cell4 = row.insertCell(3);
                cell4.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.VALOR); // valor formatado para moeda brasileira
                cell4.style.textAlign = "center";
            });
        } else {
            console.warn("Nenhuma tabela encontrada para carregar!");
        }
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
});
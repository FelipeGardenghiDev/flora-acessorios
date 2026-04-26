# 🌿 Flora Acessórios — Sistema de Gestão de Vendas

> Projeto Integrador — UNIVESP | PJI310 - A2026S1N2 - Grupo 9

Sistema web de gestão comercial voltado ao controle de vendas, produtos e vendedores de uma loja de acessórios.

---

## 📋 Sobre o Projeto

A **Flora Acessórios** é uma loja de joias e acessórios que necessitava de um sistema interno para registrar e acompanhar suas vendas. Este projeto oferece um painel administrativo com dashboard de faturamento, cadastro de vendas e consulta de dados de produtos e vendedores.

| Campo | Informação |
|-------|-----------|
| Curso | PJI310 — Projeto Integrador em Computação III |
| Turma | A2026S1N2 |
| Grupo | 9 |
| Instituição | UNIVESP |

---

## 🚀 Funcionalidades

- 📊 **Dashboard** — Gráfico de faturamento mensal (Chart.js) com formatação de cores e tooltip em R$
- 🔍 **Detalhamento por mês** — Clique em uma barra do gráfico para ver as vendas daquele mês em cards
- 🕓 **Vendas recentes** — Sidebar com as últimas 4 vendas registradas, com avatar de iniciais e tempo relativo
- 🔄 **Botão de atualizar** — Recarrega gráfico e vendas recentes com animação de rotação
- 🛒 **Cadastro de Vendas** — Registro de vendas vinculando vendedor, produto e mês
- 👥 **Vendedores** — Tabela com todos os funcionários cadastrados
- 📦 **Produtos** — Catálogo completo com categorias, códigos e valores

---

## 🗂️ Estrutura do Projeto

```
flora/
├── front-end/
│   ├── index.html                # Dashboard
│   ├── cadastro_de_vendas.html   # Formulário de venda
│   ├── vendedores.html           # Tabela de vendedores
│   ├── produtos.html             # Tabela de produtos
│   ├── scripts/
│   │   ├── conexaoAPI.js         # URL base da API
│   │   ├── dashboard.js          # Gráfico, detalhamento por mês e vendas recentes
│   │   ├── form.js               # Formulário de cadastro de venda
│   │   └── tables.js             # Tabelas de vendedores e produtos
│   ├── styles/
│   │   ├── style.css             # Estilos globais
│   │   ├── form.css              # Estilos do formulário
│   │   ├── tabela.css            # Estilos das tabelas
│   │   ├── grafico.css           # Estilos do gráfico e cards de detalhe
│   │   └── vendas_recentes.css   # Estilos da sidebar de vendas recentes
│   └── assets/
│       ├── imgs/
│       ├── icons/
│       └── fonts/
├── back-end/
│   └── php/
│       ├── conexao.php           # Conexão com o banco MySQL
│       ├── functions.php         # Funções de consulta e inserção
│       ├── carrega_dados.php     # Endpoint de leitura (GET)
│       └── salvar_venda.php      # Endpoint de escrita (POST)
└── database/
    └── flora_pi3.sql             # Script de criação do banco
```

---

## 🗄️ Banco de Dados

Banco: `flora_pi3` — MySQL via phpMyAdmin

| Tabela | Descrição |
|--------|-----------|
| `funcionario` | Dados dos vendedores |
| `produto` | Catálogo de produtos |
| `cliente` | Clientes (usado ID genérico `1` atualmente) |
| `forma_pag` | Formas de pagamento disponíveis |
| `venda_cab` | Cabeçalho da venda (vendedor, cliente, data, valor total) |
| `venda_item` | Itens de cada venda (produto, quantidade, valor unitário) |

---

## 🔌 Endpoints da API

Arquivo: `back-end/php/carrega_dados.php`

| Parâmetro (`origem=`) | Método | Descrição |
|-----------------------|--------|-----------|
| `dashboard` | GET | Faturamento total agrupado por mês |
| `vendedores` | GET | Lista de funcionários |
| `produtos` | GET | Catálogo completo de produtos |
| `produtos-form` | GET | Produtos ordenados por ID (para o select do formulário) |
| `vendas_recentes` | GET | Últimas 4 vendas com JOIN em funcionário e produto |
| `vendas_por_mes` + `&mes=N` | GET | Vendas de um mês específico (N = 1–12) |

Arquivo: `back-end/php/salvar_venda.php`

| Método | Body (JSON) | Descrição |
|--------|-------------|-----------|
| POST | `{ vendedor, codigo_produto, valor_venda, mes_venda }` | Insere venda e item de venda |

---

## ⚙️ Funções PHP (`functions.php`)

| Função | Descrição |
|--------|-----------|
| `listaVendedores()` | SELECT em `funcionario` ordenado por nome |
| `listaProdutos()` | SELECT em `produto` ordenado por categoria |
| `listaProdutosForm()` | SELECT em `produto` ordenado por ID |
| `listaVendas()` | Faturamento agrupado por mês |
| `listaVendasRecentes()` | Últimas 4 vendas com JOIN (limite 4) |
| `listaVendasPorMes($mes)` | Vendas de um mês com JOIN |
| `getVendedorByName($nome)` | Retorna `id_func` pelo nome completo |
| `geraVenda($id_func, $id_cliente, $data_venda, $valor)` | INSERT em `venda_cab` |
| `insereItemVenda($id_venda, $id_prod, $valor)` | INSERT em `venda_item` |

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Front-end | HTML5, CSS3, JavaScript (ES Modules) |
| Gráficos | Chart.js |
| Back-end | PHP 8.2 |
| Banco de dados | MySQL |
| Servidor | Apache (XAMPP/LAMPP) |

---

## ⚙️ Como Executar

### Pré-requisitos
- [XAMPP](https://www.apachefriends.org/) instalado e rodando (Apache + MySQL)

### Passo a passo

1. **Copie o projeto para o htdocs**
   ```bash
   sudo cp -r /caminho/para/flora /opt/lampp/htdocs/
   ```

2. **Inicie o XAMPP**
   ```bash
   sudo /opt/lampp/lampp start
   ```

3. **Importe o banco de dados**
   - Acesse `http://localhost/phpmyadmin`
   - Crie o banco `flora_pi3`
   - Importe o arquivo `database/flora_pi3.sql`

4. **Insira o cliente genérico** (necessário para o FK de `venda_cab`)
   ```sql
   INSERT INTO cliente (nome, sobrenome, cpf) VALUES ('Cliente', 'Padrão', '00000000000');
   ```

5. **Acesse o sistema**
   ```
   http://localhost/flora/front-end/index.html
   ```

---

## 📄 Categorias de Produtos

| Categoria | Exemplos |
|-----------|----------|
| Anel | Quadrado Abaulado, Com Pedra, Trevo |
| Brincos | Franja, Vírgula, Pérola |
| Bracelete | Elos Cravejados, Personalizado |
| Colar | Choker Esteira, Choker Malha |
| Pulseira | Esteira |

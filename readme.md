# Flora Acessórios - Sistema de Gestão de Vendas

Projeto Integrador - UNIVESP | PJI310 - A2026S1N2 - Grupo 9

Sistema web para registro e acompanhamento de vendas, com dashboard de faturamento, consulta de vendedores e catálogo de produtos.

## Sobre

A aplicação foi organizada em três camadas:

1. Front-end (HTML, CSS e JavaScript com ES Modules)
2. Back-end (PHP)
3. Banco de dados (MySQL)

Fluxo principal:

1. Usuário registra uma venda no formulário
2. API valida vendedor e dados
3. Sistema grava cabeçalho da venda e item vendido
4. Dashboard atualiza faturamento mensal e listas de vendas

## Funcionalidades Atuais

1. Dashboard com gráfico mensal de faturamento (Chart.js)
2. Filtro de ano no dashboard
3. Clique na barra do gráfico para ver detalhamento do mês/ano selecionado
4. Detalhamento com mês por extenso (ex.: Maio/2026)
5. Vendas recentes (últimas 4)
6. Botão de atualizar com animação
7. Cadastro de venda com vendedor, SKU do produto, mês e ano
8. Mês e ano atuais pré-selecionados no formulário
9. Alerta personalizado (toast) de sucesso/erro ao registrar venda
10. Tabela de vendedores
11. Tabela de produtos com ordem: Código, Categoria, Nome, Valor
12. Acessibilidade básica no menu principal e no canvas do dashboard

## Estrutura do Projeto

```text
flora-acessorios/
├── front-end/
│   ├── index.html
│   ├── cadastro_de_vendas.html
│   ├── vendedores.html
│   ├── produtos.html
│   ├── scripts/
│   │   ├── conexaoAPI.js
│   │   ├── dashboard.js
│   │   ├── form.js
│   │   └── tables.js
│   ├── styles/
│   │   ├── style.css
│   │   ├── form.css
│   │   ├── tabela.css
│   │   ├── grafico.css
│   │   └── vendas_recentes.css
│   └── assets/
│       ├── imgs/
│       ├── icons/
│       └── fonts/
├── back-end/
│   └── php/
│       ├── conexao.php
│       ├── functions.php
│       ├── carrega_dados.php
│       └── salvar_venda.php
├── database/
│   └── flora_pi3.sql
└── readme.md
```

## Banco de Dados

Banco: flora_pi3

### Tabelas

1. funcionario
2. produto
3. venda_cab
4. venda_item

### Modelo Atual

1. Não existe tabela de cliente
2. Não existe tabela de forma de pagamento
3. Produto usa SKU textual como chave primária (id_prod), ex.: ANE-001
4. venda_item.id_prod referencia produto.id_prod (varchar)

## API

Base URL (ambiente local atual):

```text
http://localhost/flora-acessorios/back-end/php
```

### Endpoint de leitura

Arquivo: back-end/php/carrega_dados.php

1. GET ?origem=dashboard&ano=YYYY
2. GET ?origem=anos_dashboard
3. GET ?origem=vendedores
4. GET ?origem=produtos
5. GET ?origem=produtos-form
6. GET ?origem=vendas_recentes
7. GET ?origem=vendas_por_mes&mes=N&ano=YYYY

Observações:

1. Mês em vendas_por_mes vai de 1 a 12
2. Filtro de ano no dashboard depende de dados existentes em venda_cab

### Endpoint de escrita

Arquivo: back-end/php/salvar_venda.php

Método: POST (JSON)

```json
{
  "vendedor": "Mariana Silva",
  "codigo_produto": "ANE-001",
  "valor_venda": 168.00,
  "mes_venda": "05",
  "ano_venda": "2026"
}
```

## Funções PHP Principais

Arquivo: back-end/php/functions.php

1. listaVendedores()
2. listaProdutos()
3. listaProdutosForm()
4. listaAnosVendas()
5. listaVendas($ano = null)
6. listaVendasRecentes()
7. listaVendasPorMes($mes, $ano = null)
8. getVendedorByName($vendedor)
9. geraVenda($id_func, $data_venda, $valor)
10. insereItemVenda($id_venda, $id_prod, $valor)

## Front-end (Resumo)

### Dashboard

Arquivo: front-end/scripts/dashboard.js

1. Carrega anos disponíveis via API
2. Seleciona ano atual automaticamente
3. Carrega gráfico por ano
4. Detalha vendas por mês + ano ao clicar na barra
5. Mostra cursor pointer somente sobre barras clicáveis

### Cadastro de vendas

Arquivo: front-end/scripts/form.js

1. Popula meses dinamicamente
2. Popula anos dinamicamente (de 2025 até o ano atual)
3. Pré-seleciona mês e ano atuais
4. Envia SKU como codigo_produto
5. Exibe toast customizado sem redirecionamento

## Acessibilidade Básica

Aplicada no menu principal das páginas:

1. index.html
2. cadastro_de_vendas.html
3. produtos.html
4. vendedores.html

Pontos aplicados:

1. aria-label no nav principal
2. aria-label nos links de navegação
3. role e aria-label no canvas do dashboard

## Tecnologias

1. HTML5
2. CSS3
3. JavaScript (ES Modules)
4. Chart.js
5. PHP
6. MySQL
7. Apache (XAMPP)

## Como Executar (Windows + XAMPP)

1. Coloque a pasta flora-acessorios dentro de c:/xampp/htdocs
2. Inicie Apache e MySQL no painel do XAMPP
3. Abra http://localhost/phpmyadmin
4. Exclua o banco flora_pi3 (se existir) e crie novamente
5. Importe database/flora_pi3.sql
6. Acesse o sistema em:

```text
http://localhost/flora-acessorios/front-end/index.html
```

## Dados Iniciais de Produto (SKU)

Exemplos já incluídos no SQL:

1. ANE-001
2. BRI-001
3. BRA-001
4. BRA-002
5. ANE-002
6. BRI-002
7. COL-001
8. PUL-001
9. COL-002
10. ANE-003
11. BRI-003

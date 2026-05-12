<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');
require_once './functions.php';

// Ler dados JSON da requisição
$data = json_decode(file_get_contents("php://input"), true);

// Pegar os dados do formulário
$vendedor = $data['vendedor'] ?? null;
$id_prod = $data['codigo_produto'] ?? null;
$valor = $data['valor_venda'] ?? null;
$mes_venda = $data['mes_venda'] ?? null;
$ano_venda = $data['ano_venda'] ?? null;

// Validar dados
if (!$vendedor || !$id_prod || !$valor || !$mes_venda || !$ano_venda) {
    echo json_encode(["erro" => "Dados incompletos!"]);
    exit;
}

// Buscar ID do vendedor
$id_func = getVendedorByName($vendedor);

if (!$id_func) {
    echo json_encode(["erro" => "Vendedor não encontrado!"]);
    exit;
}

// Formatar data de venda para o formato do banco de dados (datetime do mysql)

// Mês já vem em formato numérico (01, 02, 03...) e ano é o ano completo
$data_venda = $ano_venda . '-' . $mes_venda . '-' . date('d');
if (!$data_venda) {
    echo json_encode(["erro" => "Data de venda inválida!"]);
    exit;
}

// Inserir venda e obter ID da venda recém-criada no banco de dados
$id_venda = geraVenda($id_func, $data_venda, $valor);

if (!$id_venda) {
    echo json_encode(["erro" => "Erro ao inserir venda!"]);
    exit;
}

// Inserir item da venda e obter ID do item da venda recém-criado no banco de dados
$idItemVenda = insereItemVenda($id_venda, $id_prod, $data_venda, $valor);

if (!$idItemVenda) {
    echo json_encode(["erro" => "Erro ao inserir item!"]);
    exit;
}

// Retornar resposta de sucesso
echo json_encode(["status" => "ok"]);
?>
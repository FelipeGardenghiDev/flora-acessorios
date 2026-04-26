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

// Validar dados
if (!$vendedor || !$id_prod || !$valor) {
    echo json_encode(["erro" => "Dados incompletos!"]);
    exit;
}

// Buscar ID do vendedor
$id_func = getVendedorByName($vendedor);

if (!$id_func) {
    echo json_encode(["erro" => "Vendedor não encontrado!"]);
    exit;
}

// Buscar ID do cliente (aqui estamos usando um cliente genérico, já que o formulário não tem campo para isso)
// Precisa corrigir caso queira usar clientes reais, mas por enquanto vamos usar um ID genérico para evitar erros de chave estrangeira,
// embora todas as vendas fiquem associadas a esse cliente genérico, o que não é ideal, mas serve para fins de teste
$id_cliente = 1; // ID do cliente genérico, pode ser ajustado conforme necessário

// Formatar data de venda para o formato do banco de dados (datetime do mysql)
if ($mes_venda) {
    // mes_venda so traz mes com 3 primeiros caracteres de mes, entao pega o dia atual, junta com o mes do select, e junta com o ano atual
    $data_venda = date('Y') . '-' . date('m', strtotime($mes_venda)) . '-' . date('d');
} else {
     // Se mes_venda não for fornecido, usar a data atual
     $data_venda = date('Y-m-d H:i:s');
}

if (!$data_venda) {
    echo json_encode(["erro" => "Data de venda inválida!"]);
    exit;
}

// Inserir venda e obter ID da venda recém-criada no banco de dados
$id_venda = geraVenda($id_func, $id_cliente, $data_venda, $valor);

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
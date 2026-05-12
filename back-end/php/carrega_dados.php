<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');
require_once './functions.php';

$origem = $_GET['origem'] ? $_GET['origem'] : ($_POST['origem'] ? $_POST['origem'] : null);

if ($origem === 'dashboard') {
    $ano = isset($_GET['ano']) ? intval($_GET['ano']) : null;
    $dados = listaVendas($ano);
    echo json_encode($dados);
} else if ($origem === 'anos_dashboard') {
    $dados = listaAnosVendas();
    echo json_encode($dados);
} else if ($origem === 'vendedores') {
    $dados = listaVendedores();
    echo json_encode($dados);
} elseif ($origem === 'produtos') {
    $dados = listaProdutos();
    echo json_encode($dados);
} elseif ($origem === 'produtos-form') {
    $dados = listaProdutosForm();
    echo json_encode($dados);
} elseif ($origem === 'vendas_recentes') {
    $dados = listaVendasRecentes();
    echo json_encode($dados);
} elseif ($origem === 'vendas_por_mes') {
    $mes = isset($_GET['mes']) ? intval($_GET['mes']) : null;
    $ano = isset($_GET['ano']) ? intval($_GET['ano']) : null;
    if (!$mes) {
        echo json_encode(['error' => 'Mês inválido']);
    } else {
        $dados = listaVendasPorMes($mes, $ano);
        echo json_encode($dados);
    }
} else {
    echo json_encode(['error' => 'Origem inválida']);
}

?>
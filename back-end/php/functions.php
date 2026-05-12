<?php
require_once './conexao.php';

function listaVendedores() {
    global $conn;
    $sql = "SELECT F.id_func AS ID, 
                   CONCAT(F.nome, ' ', F.sobrenome) AS NOME_COMPLETO, 
                   F.cpf AS CPF,
                   F.admissao AS ADMISSAO,
                   F.desligamento AS DESLIGAMENTO
              FROM funcionario F
              ORDER BY NOME_COMPLETO ASC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function listaProdutos() {
    global $conn;
    $sql = "SELECT P.id_prod AS ID, 
                   P.categoria AS CATEGORIA, 
                   P.descricao AS DESCRICAO, 
                   P.valor AS VALOR 
              FROM produto P
                ORDER BY P.categoria ASC, P.id_prod ASC, P.descricao ASC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function listaProdutosForm() {
    global $conn;
    $sql = "SELECT P.id_prod AS ID, 
                   P.categoria AS CATEGORIA, 
                   P.descricao AS DESCRICAO, 
                   P.valor AS VALOR 
              FROM produto P
              ORDER BY P.id_prod ASC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function listaAnosVendas() {
    global $conn;
    $sql = "SELECT DISTINCT YEAR(VC.data_venda) AS ANO
              FROM venda_cab VC
          ORDER BY ANO DESC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function listaVendas($ano = null) {
    global $conn;

    if ($ano) {
        $sql = "SELECT MONTH(VC.data_venda) AS MES,
                       SUM(valor_total) AS TOTAL
                  FROM venda_cab VC
                 WHERE YEAR(VC.data_venda) = ?
              GROUP BY MONTH(VC.data_venda)
              ORDER BY MONTH(VC.data_venda) ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $ano);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    $sql = "SELECT MONTH(VC.data_venda) AS MES,
                   SUM(valor_total) AS TOTAL
              FROM venda_cab VC
          GROUP BY YEAR(VC.data_venda), MONTH(VC.data_venda)
          ORDER BY VC.data_venda DESC";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function getVendedorByName($vendedor) {
    global $conn;
    $sql = "SELECT id_func FROM funcionario WHERE CONCAT(nome, ' ', sobrenome) = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $vendedor);
    $stmt->execute();
    $vendedorID = $stmt->get_result();
    $vendedorID = $vendedorID->fetch_assoc()['id_func'] ?? null;
    return $vendedorID;
}

function geraVenda($id_func, $data_venda, $valor) {
    global $conn;
    $sql = "INSERT INTO venda_cab (id_func, data_venda, valor_total)
            VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isd", $id_func, $data_venda, $valor);
    $stmt->execute();
    return $stmt->insert_id;
}

function insereItemVenda($id_venda, $id_prod, $valor) {
    global $conn;
    $sql = "INSERT INTO venda_item (id_venda, id_prod, quantidade, valor_unit)
            VALUES (?, ?, 1, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isd", $id_venda, $id_prod, $valor);
    return $stmt->execute();
}

function listaVendasRecentes() {
    global $conn;
    $sql = "SELECT VC.id_venda AS ID,
                   CONCAT(F.nome, ' ', F.sobrenome) AS VENDEDOR,
                   P.categoria AS CATEGORIA,
                   P.descricao AS NOME,
                   VC.valor_total AS VALOR,
                   VC.data_venda AS DATA_VENDA
              FROM venda_cab VC
              JOIN funcionario F ON VC.id_func = F.id_func
              JOIN venda_item VI ON VC.id_venda = VI.id_venda
              JOIN produto P ON VI.id_prod = P.id_prod
             ORDER BY VC.data_venda DESC
                 LIMIT 4";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function listaVendasPorMes($mes, $ano = null) {
    global $conn;
    $sql = "SELECT VC.id_venda AS ID,
                   CONCAT(F.nome, ' ', F.sobrenome) AS VENDEDOR,
                   P.categoria AS CATEGORIA,
                   P.descricao AS NOME,
                   VC.valor_total AS VALOR,
                   VC.data_venda AS DATA_VENDA
              FROM venda_cab VC
              JOIN funcionario F ON VC.id_func = F.id_func
              JOIN venda_item VI ON VC.id_venda = VI.id_venda
              JOIN produto P ON VI.id_prod = P.id_prod
             WHERE MONTH(VC.data_venda) = ?";

    if ($ano) {
        $sql .= " AND YEAR(VC.data_venda) = ?";
    }

    $sql .= " ORDER BY VC.data_venda DESC";
    $stmt = $conn->prepare($sql);

    if ($ano) {
        $stmt->bind_param("ii", $mes, $ano);
    } else {
        $stmt->bind_param("i", $mes);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);
}

?>
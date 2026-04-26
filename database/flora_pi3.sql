SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `flora_pi3`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `sobrenome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `forma_pag`
--

CREATE TABLE `forma_pag` (
  `id_pag` int(11) NOT NULL,
  `descricao` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `forma_pag`
--

INSERT INTO `forma_pag` (`id_pag`, `descricao`) VALUES
(1, 'Dinheiro'),
(2, 'PIX'),
(3, 'Cartão de Crédito'),
(4, 'Cartão de Débito'),
(5, 'Boleto');

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionario`
--

CREATE TABLE `funcionario` (
  `id_func` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `sobrenome` varchar(100) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `admissao` date NOT NULL,
  `desligamento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `funcionario`
--

INSERT INTO `funcionario` (`id_func`, `nome`, `sobrenome`, `cpf`, `admissao`, `desligamento`) VALUES
(1, 'Mariana', 'Silva', '12345678901', '2026-01-21', NULL),
(2, 'Ricardo', 'Oliveira', '12345678902', '2025-04-22', NULL),
(3, 'Beatriz', 'Souza', '12345678903', '2024-10-16', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_prod` int(11) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `descricao` varchar(100) NOT NULL,
  `valor` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_prod`, `categoria`, `descricao`, `valor`) VALUES
(1, 'Anel', 'Quadrado Abaulado', 168.00),
(2, 'Brincos', 'Franja', 174.00),
(3, 'Bracelete', 'Elos Cravejados', 324.00),
(4, 'Bracelete', 'Personalizado', 334.00),
(5, 'Anel', 'Com Pedra', 170.00),
(6, 'Brincos', 'Vírgula', 96.00),
(7, 'Colar', 'Choker Esteira', 228.00),
(8, 'Pulseira', 'Esteira', 128.00),
(9, 'Colar', 'Choker Malha', 144.00),
(10, 'Anel', 'Trevo', 96.00),
(11, 'Brincos', 'Pérola', 228.00);

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda_cab`
--

CREATE TABLE `venda_cab` (
  `id_venda` int(11) NOT NULL,
  `id_func` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_pag` int(11) NOT NULL,
  `data_venda` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `venda_item`
--

CREATE TABLE `venda_item` (
  `id_item` int(11) NOT NULL,
  `id_venda` int(11) NOT NULL,
  `id_prod` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `valor_unit` decimal(10,2) NOT NULL,
  `desconto_perc` decimal(5,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `UNIQUE` (`cpf`);

--
-- Índices de tabela `forma_pag`
--
ALTER TABLE `forma_pag`
  ADD PRIMARY KEY (`id_pag`);

--
-- Índices de tabela `funcionario`
--
ALTER TABLE `funcionario`
  ADD PRIMARY KEY (`id_func`),
  ADD UNIQUE KEY `UNIQUE` (`cpf`) USING BTREE;

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_prod`);

--
-- Índices de tabela `venda_cab`
--
ALTER TABLE `venda_cab`
  ADD PRIMARY KEY (`id_venda`),
  ADD KEY `fk_funcionario` (`id_func`) USING BTREE,
  ADD KEY `fk_forma_pag` (`id_pag`) USING BTREE,
  ADD KEY `fk_cliente` (`id_cliente`) USING BTREE;

--
-- Índices de tabela `venda_item`
--
ALTER TABLE `venda_item`
  ADD PRIMARY KEY (`id_item`) USING BTREE,
  ADD KEY `fk_venda_cab` (`id_venda`) USING BTREE,
  ADD KEY `fk_produto` (`id_prod`) USING BTREE;

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `forma_pag`
--
ALTER TABLE `forma_pag`
  MODIFY `id_pag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `funcionario`
--
ALTER TABLE `funcionario`
  MODIFY `id_func` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_prod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `venda_cab`
--
ALTER TABLE `venda_cab`
  MODIFY `id_venda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `venda_item`
--
ALTER TABLE `venda_item`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `venda_cab`
--
ALTER TABLE `venda_cab`
  ADD CONSTRAINT `FK` FOREIGN KEY (`id_func`) REFERENCES `funcionario` (`id_func`),
  ADD CONSTRAINT `fk_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  ADD CONSTRAINT `fk_pag` FOREIGN KEY (`id_pag`) REFERENCES `forma_pag` (`id_pag`);

--
-- Restrições para tabelas `venda_item`
--
ALTER TABLE `venda_item`
  ADD CONSTRAINT `fk_id_prod` FOREIGN KEY (`id_prod`) REFERENCES `produto` (`id_prod`),
  ADD CONSTRAINT `fk_id_venda` FOREIGN KEY (`id_venda`) REFERENCES `venda_cab` (`id_venda`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

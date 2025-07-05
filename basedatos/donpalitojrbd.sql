-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-06-2025 a las 18:33:13
-- Versión del servidor: 8.0.41
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `donpalitojrbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `idCategoria` int NOT NULL COMMENT 'Identificador único de la categoría',
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Nombre de la categoría',
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Descripción de la categoría',
  `imagen` longblob COMMENT 'Imagen representativa de la categoría',
  `estado` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo' COMMENT 'Activo o Inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chats`
--

CREATE TABLE `chats` (
  `idChat` int NOT NULL,
  `cliente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `agente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Abierto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `idComentario` int NOT NULL,
  `idUsuario` int NOT NULL,
  `idProducto` int NOT NULL,
  `calificacion` int NOT NULL,
  `texto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

CREATE TABLE `detalle_pedidos` (
  `idDetalle` int NOT NULL,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas`
--

CREATE TABLE `facturas` (
  `idFactura` int NOT NULL,
  `idPedido` int NOT NULL,
  `fecha` date NOT NULL,
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `idMensaje` int NOT NULL,
  `idChat` int NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remitente` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fechaHora` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `idNotificacion` int NOT NULL,
  `tipoEvento` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `canal` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `activo` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `idPedido` int NOT NULL,
  `idUsuario` int NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Pendiente',
  `total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `idPerfil` int NOT NULL,
  `documento` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nombreCompleto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `respuesta1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `respuesta2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `respuesta3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaExpedicion` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correoAlternativo` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `idPregunta1` int DEFAULT NULL,
  `idPregunta2` int DEFAULT NULL,
  `idPregunta3` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`idPerfil`, `documento`, `nombreCompleto`, `telefono`, `correo`, `respuesta1`, `respuesta2`, `respuesta3`, `direccion`, `fechaExpedicion`, `correoAlternativo`, `idPregunta1`, `idPregunta2`, `idPregunta3`) VALUES
(48, '92549388', 'Jair Enrique González', '3187074019', 'jairgonzalezb@hotmail.com', '$2b$10$gEwfn5miHKP6j8FDtiGJ1ueTGy2I7khSKKHDEU.34ntN34lwCliPO', '$2b$10$ahQ3tayQgvIIrc4i/KS8MehRLxhDbrjn0yLe5XFAZoS9HNqciB5SS', '$2b$10$5A7v5og/003rV3Kwjh5n7upAr2/cLjiqPLeQIKKLQjCQ0g4LXwB/u', 'Calle 45 # 12-34', '2002-10-09', 'random777gamer@gmail.com', 5, 6, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personalizacion`
--

CREATE TABLE `personalizacion` (
  `idSeccion` int NOT NULL,
  `contenidoTexto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `imagen` longblob,
  `color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_seguridad`
--

CREATE TABLE `preguntas_seguridad` (
  `idPregunta` int NOT NULL,
  `pregunta` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `preguntas_seguridad`
--

INSERT INTO `preguntas_seguridad` (`idPregunta`, `pregunta`) VALUES
(1, '¿Cuál es el nombre de tu primera mascota?'),
(2, '¿En qué ciudad naciste?'),
(3, '¿Cuál es tu película favorita?'),
(4, '¿Cuál es el nombre de tu mejor amigo de la infancia?'),
(5, '¿Cuál es tu comida favorita?'),
(6, '¿Cuál es tu nickname en videojuegos?'),
(7, '¿Cuál es el nombre de la calle donde creciste?'),
(8, '¿Cuál es el segundo nombre de tu madre?'),
(9, '¿Cómo se llama tu personaje favorito de ficción?'),
(10, '¿Cuál es tu pasatiempo favorito?');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idProducto` int NOT NULL COMMENT 'Identificador único del producto',
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Nombre del producto',
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Breve descripción del producto',
  `precio` decimal(10,2) NOT NULL COMMENT 'Precio del producto',
  `cantidad` int NOT NULL COMMENT 'Cantidad disponible en el inventario',
  `imagen` longblob COMMENT 'Ruta de la imagen del producto',
  `estado` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Controla si el producto está Activo/Inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProducto`, `nombre`, `descripcion`, `precio`, `cantidad`, `imagen`, `estado`) VALUES
(2, 'Palito Premium - Puro Queso.', 'Palito relleno de Queso Mozarella.', 2500.00, 10, 0x89504e470d0a1a0a0000000d4948445200000018000000180806000000e0773df800000009704859730000038b0000038b0175cb17fb0000001974455874536f667477617265007777772e696e6b73636170652e6f72679bee3c1a00000352494441544889ed94cd4f5c6514c67fe7bd73ef305fcc073020b4d0d086b6f483144235a636b89090365121b1baaa1f7f851bdb8d0b174dba34ba3236b189098ad5e8a22612eb46372d465b9242218050714060861998b9f73d2e0825ca6c2c266efaacdec57b9edf39cf490e3cd1ff2dd94bb17ed717f2d7a69e1375eb9c97268645d03d03f4831e37685c193235d93715ed96fa671d1ccf63e1e6afc26abf9c9b58fbd700fdb2bdd54a64489cc80bb69cbb26a9ae0fcdc97713a43a01839dff1611bfa263efdc3335f11e797ed4dfae0d553554849183dd369c7a0d718634d29490fd8349423131b39f3d2d272e27a869c24e0f630ebc82240f23b1fd2e6b1387ec838f2e0197764da05f1f0afb65bfcf441adfc0da3e499f0cb16fb04eb26745cb2b200e126ddefa9b7fb0559c68070dd0db6f835f40baafc01f3f7c2ccd03af6ffb9aed87efbbb78d897c4379e555c99cca90e949e3d4089bb9ad3e8cbb936bb80e09670826afc1660e5d1b07bf008529547540475a3bab44145eb6ad1705f190e2b4a773a388bde14bb0aed84d833842b4d96aed1195d4f190c40f8ad3dc0f358d48fb45a8e421750ca9edc8d276210b57ee56dd81da322a2e921d4021a4ebe3483987a64ec3c6ef86fc0c921bb3046bbe041b46c50aa15449e2ade0e7219488f1f0d66560b42a40dc148462db38ccf2f7485d2fc1fa24c48fa2a5dfa069d0b07edfe0a651af01b41263631ebb3c8159bf57b17eb969d70e54edcf2cdd5a212821f3d79185eba0164d74a2852988b46d359079068a9338e51964f106a8c2ea2f68a40d6abb09eacfbba82eed0288d9f8448a73bef805c48b23046037d0d4196c7608ca7f82561e4da9c519f0d22002c9e3ff0ce2917622d2e87bfad4b97ac20d68ac0b110f9c18ac8e41fc083861b001e826ead6a32d6fedb8044564710471920499beea0075749885cfeb0ca4d5890a5e83a1345b4b38eb618b60cb2a73efe714b348fce83eb2fd495dfe09c99c86f23226d2b23595daea00effcd855e02a807ed59aaeac3fec30f9bb8771e3bd8ae9125b69b35ab8e0bd3cfda3ff859db5e16cad445b84a004d10304b684d4778298bf011eeb9a9687db7bc584ce8a099f52e184a86950e31909d707b8c9a4e6c7efb82fde39f3d8806ad24f8fc52bce668711ed50cc923b74ffe67fe5fd447bd35ffd8c4f02548f56650000000049454e44ae426082, 'Activo'),
(3, 'Palito Premium - Queso y Bocadillo', 'Palito relleno de Queso Mozarella y Bocadillo.', 2500.00, 10, NULL, 'Activo'),
(4, 'Palito Premium - Queso y Jamón.', 'Palito relleno de Queso Mozzarella y Jamón.', 2500.00, 10, NULL, 'Activo'),
(5, 'Palito Coctelero - Puro Queso.', 'Palito pequeño, relleno de Queso Mozzarella.', 1000.00, 10, NULL, 'Activo'),
(6, 'Palito Coctelero - Queso y Bocadillo.', 'Palito pequeño, relleno de Queso Mozzarella y Bocadillo.', 1000.00, 10, NULL, 'Activo'),
(7, 'Palito Coctelero - Queso y Chocolate.', 'Palito pequeño, relleno de Queso Mozzarella y Chocolate semiamargo.', 1000.00, 10, NULL, 'Activo'),
(8, 'Palito Coctelero - Queso y Jamón.', 'Palito pequeño, relleno de Queso Mozzarella y Jamón.', 1000.00, 10, NULL, 'Activo'),
(9, 'Buñuelo', 'Buñuelo antioqueño tradicional de 50 gramos.', 1000.00, 10, NULL, 'Activo'),
(10, 'Hojuela.', 'También conocida como Hojaldra.', 1000.00, 10, NULL, 'Activo'),
(11, 'Pali-Papa.', 'Combinado de Palito de Queso y Papa Rellena.', 2000.00, 10, NULL, 'Activo'),
(12, 'Oblea.', 'Oblea tradicional cubierta con Arequipe, Crema de Leche, Queso y Mora.', 5000.00, 10, NULL, 'Activo'),
(13, 'Panocha.', 'Combinado de Palito de Queso y Albondigón.', 6000.00, 10, NULL, 'Activo'),
(14, 'Natilla - Plato.', 'Porción personal pequeña de Natilla.', 5000.00, 10, NULL, 'Activo'),
(15, 'Natilla - Bandeja Personal.', 'Porción personal grande de Natilla.', 10000.00, 10, NULL, 'Activo'),
(16, 'Natilla - Bandeja Familiar.', 'Bandeja de Natilla para 4 a 6 personas.', 40000.00, 10, NULL, 'Activo'),
(17, 'Plato Navideño.', 'Porción personal de Natilla y Buñuelos.', 5000.00, 10, NULL, 'Activo'),
(18, 'Caja Navideña.', 'Porción personal de Natilla, Buñuelos y Hojuelas.', 7000.00, 10, NULL, 'Activo'),
(19, 'Masa Buñuelos - 1 libra.', '500 gramos de masa lista para preparar Buñuelos.', 12000.00, 10, NULL, 'Activo'),
(20, 'Masa Hojuelas - 1 libra.', '500 gramos de masa lista para preparar Hojuelas.', 10000.00, 10, NULL, 'Activo'),
(21, 'Palito Premium - Congelado.', 'Bandeja por 5 o 10 unidades.', 0.00, 10, NULL, 'Activo'),
(22, 'Palito Coctelero - Congelado.', 'Bandeja por 10 o 20 unidades.', 0.00, 10, NULL, 'Activo'),
(23, 'Palito Doble Queso - Congelado.', 'Bandeja por 10 unidades.', 0.00, 10, NULL, 'Activo'),
(24, 'Palito Económico - Congelado.', 'Bandeja por 10 unidades.', 0.00, 10, NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `idPromocion` int NOT NULL COMMENT 'Identificador único de la promoción',
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Título de la promoción',
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Descripción de la promoción',
  `tipo` enum('producto','categoria') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Tipo de promoción',
  `valor` decimal(5,2) NOT NULL COMMENT 'Valor del descuento en porcentaje',
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `estado` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recuperaciones`
--

CREATE TABLE `recuperaciones` (
  `idRecuperacion` int NOT NULL,
  `correo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expiracion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `token`
--

CREATE TABLE `token` (
  `idToken` int NOT NULL,
  `usuario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `llave` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL,
  `documento` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombreCompleto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rol` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Administrador',
  `estado` enum('Activo','Inactivo','Bloqueado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo',
  `fechaCreacion` datetime NOT NULL,
  `intentosFallidos` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUsuario`, `documento`, `nombreCompleto`, `telefono`, `correo`, `contrasena`, `rol`, `estado`, `fechaCreacion`, `intentosFallidos`) VALUES
(5, '64565503', 'Rosiris Buelvas Pedroza', '3105135347', 'rochybp01@gmail.com', 'Rochy/1234', 'Admin', 'Activo', '2025-05-22 19:16:01', 0),
(6, '71710169', 'Luis Eduardo Muñoz', '3148702078', 'luchodonpalito@gmail.com', 'Lucho/1234', 'Admin', 'Activo', '2025-05-22 19:16:01', 0),
(48, '92549388', 'Jair Enrique González', '3187074019', 'jairgonzalezb@hotmail.com', '$2b$10$62ELpoVruZ1yyeXMYBKKde8gmXnSl8quxYJw52UQ/vw2SicsWodr2', 'Administrador', 'Inactivo', '2025-06-30 11:44:09', 0);

--
-- Disparadores `usuarios`
--
DELIMITER $$
CREATE TRIGGER `bloquear_usuario_si_falla` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
  IF NEW.intentosFallidos >= 3 THEN
    SET NEW.estado = 'Inactivo';
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `crear_perfil_despues_usuario` AFTER INSERT ON `usuarios` FOR EACH ROW BEGIN
  INSERT INTO perfil (idPerfil, documento, nombreCompleto, telefono, correo)
  VALUES (NEW.idUsuario, NEW.documento, NEW.nombreCompleto, NEW.telefono, NEW.correo);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `incrementar_intentos_fallidos` BEFORE UPDATE ON `usuarios` FOR EACH ROW BEGIN
  IF NEW.intentosFallidos > OLD.intentosFallidos THEN
    SET NEW.intentosFallidos = OLD.intentosFallidos + 1;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int NOT NULL COMMENT 'Identificador único de la venta',
  `idProducto` int NOT NULL COMMENT 'Relación con la tabla productos',
  `cantidadVendida` int NOT NULL COMMENT 'Cantidad de unidades vendidas',
  `fechaVenta` date NOT NULL COMMENT 'Fecha en que se realizó la venta',
  `totalVenta` decimal(10,2) NOT NULL COMMENT 'Monto total de la venta',
  `estado` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Exitosa' COMMENT 'Estado de la venta (Exitosa o Cancelada)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `idProducto`, `cantidadVendida`, `fechaVenta`, `totalVenta`, `estado`) VALUES
(2, 2, 1, '2025-03-18', 2500.00, 'Exitosa'),
(3, 9, 1, '2025-03-18', 1000.00, 'Exitosa'),
(4, 10, 1, '2025-03-18', 1000.00, 'Exitosa'),
(5, 11, 1, '2025-03-17', 2000.00, 'Exitosa'),
(6, 18, 1, '2025-03-17', 7000.00, 'Cancelada');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`idCategoria`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `chats`
--
ALTER TABLE `chats`
  ADD PRIMARY KEY (`idChat`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`idComentario`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`idDetalle`),
  ADD KEY `idPedido` (`idPedido`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`idFactura`),
  ADD KEY `idPedido` (`idPedido`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`idMensaje`),
  ADD KEY `idChat` (`idChat`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`idNotificacion`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `idUsuario` (`idUsuario`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`idPerfil`);

--
-- Indices de la tabla `personalizacion`
--
ALTER TABLE `personalizacion`
  ADD PRIMARY KEY (`idSeccion`);

--
-- Indices de la tabla `preguntas_seguridad`
--
ALTER TABLE `preguntas_seguridad`
  ADD PRIMARY KEY (`idPregunta`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idProducto`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`idPromocion`);

--
-- Indices de la tabla `recuperaciones`
--
ALTER TABLE `recuperaciones`
  ADD PRIMARY KEY (`idRecuperacion`);

--
-- Indices de la tabla `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`idToken`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `telefono` (`telefono`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`),
  ADD KEY `idx_idProducto` (`idProducto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `idCategoria` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la categoría';

--
-- AUTO_INCREMENT de la tabla `chats`
--
ALTER TABLE `chats`
  MODIFY `idChat` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `idComentario` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  MODIFY `idDetalle` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `idFactura` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `idMensaje` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `idNotificacion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `idPedido` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `perfil`
--
ALTER TABLE `perfil`
  MODIFY `idPerfil` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `personalizacion`
--
ALTER TABLE `personalizacion`
  MODIFY `idSeccion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas_seguridad`
--
ALTER TABLE `preguntas_seguridad`
  MODIFY `idPregunta` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idProducto` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único del producto', AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `idPromocion` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la promoción';

--
-- AUTO_INCREMENT de la tabla `recuperaciones`
--
ALTER TABLE `recuperaciones`
  MODIFY `idRecuperacion` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `token`
--
ALTER TABLE `token`
  MODIFY `idToken` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `idVenta` int NOT NULL AUTO_INCREMENT COMMENT 'Identificador único de la venta', AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`),
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`);

--
-- Filtros para la tabla `detalle_pedidos`
--
ALTER TABLE `detalle_pedidos`
  ADD CONSTRAINT `detalle_pedidos_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`),
  ADD CONSTRAINT `detalle_pedidos_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`);

--
-- Filtros para la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`);

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`idChat`) REFERENCES `chats` (`idChat`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `cf_ventas_idProducto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

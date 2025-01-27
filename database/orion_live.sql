-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 26 jan. 2025 à 20:28
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `orion_live`
--

-- --------------------------------------------------------

--
-- Structure de la table `login_info_temp`
--

CREATE TABLE `login_info_temp` (
  `id` bigint(20) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device_id` varchar(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `login_info_temp`
--

INSERT INTO `login_info_temp` (`id`, `ip_address`, `user_agent`, `device_id`, `created_at`, `used`) VALUES
(1, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-21 01:57:28', 1),
(2, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-21 01:57:45', 1),
(3, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-21 02:13:51', 1),
(4, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-21 02:14:56', 1),
(5, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:20:14', 0),
(6, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:20:28', 0),
(7, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:20:39', 1),
(8, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:22:11', 1),
(9, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:24:10', 1),
(10, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-24 21:24:57', 1),
(11, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 00:43:32', 1),
(12, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:22:00', 1),
(13, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:39:13', 1),
(14, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:42:09', 1),
(15, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:42:40', 1),
(16, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:43:55', 1),
(17, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:44:01', 1),
(18, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:45:09', 1),
(19, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:45:16', 1),
(20, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:45:21', 1),
(21, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:45:27', 1),
(22, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 04:46:22', 1),
(23, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-25 15:46:31', 1);

-- --------------------------------------------------------

--
-- Structure de la table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `profiles`
--

CREATE TABLE `profiles` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `profiles`
--

INSERT INTO `profiles` (`id`, `user_id`, `first_name`, `last_name`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 1, 'Toto', 'Orion', 'https://i.imgur.com/feQ5d0y.png', '2025-01-21 01:34:46', '2025-01-25 04:39:01'),
(2, 2, 'Thomas', 'Devulder', 'https://i.imgur.com/feQ5d0y.png', '2025-01-21 01:41:13', '2025-01-25 04:38:19');

-- --------------------------------------------------------

--
-- Structure de la table `promo_codes`
--

CREATE TABLE `promo_codes` (
  `id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `discount_percentage` int(11) NOT NULL,
  `valid_from` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `valid_until` timestamp NULL DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `times_used` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `security_logs`
--

CREATE TABLE `security_logs` (
  `id` bigint(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `error` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `security_logs`
--

INSERT INTO `security_logs` (`id`, `type`, `email`, `ip_address`, `user_agent`, `status`, `error`, `created_at`) VALUES
(1, 'REGISTER_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 01:34:45'),
(2, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 01:34:53'),
(3, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"3 minutes\"}', '2025-01-21 01:38:51'),
(4, 'PRE_GOOGLE_LOGIN', 'pending_google_auth', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'PENDING', NULL, '2025-01-21 01:39:12'),
(5, 'PRE_GOOGLE_LOGIN', 'pending_google_auth', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'PENDING', NULL, '2025-01-21 01:39:38'),
(6, 'PRE_GOOGLE_LOGIN', 'pending_google_auth', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'PENDING', NULL, '2025-01-21 01:41:11'),
(7, 'GOOGLE_REGISTER', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', NULL, '2025-01-21 01:41:13'),
(8, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"4 minutes\"}', '2025-01-21 01:45:19'),
(9, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"deviceId\":\"b23a6a8439c0dde5515893e7c90c1e3233b8616e634470f20dc4928bcf3609bc\"}', '2025-01-21 01:49:53'),
(10, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 01:49:55'),
(11, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"deviceId\":\"b23a6a8439c0dde5515893e7c90c1e3233b8616e634470f20dc4928bcf3609bc\"}', '2025-01-21 01:51:33'),
(12, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 01:52:00'),
(13, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"deviceId\":\"b23a6a8439c0dde5515893e7c90c1e3233b8616e634470f20dc4928bcf3609bc\"}', '2025-01-21 01:52:05'),
(14, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'unknown', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 01:52:08'),
(15, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 01:57:31'),
(16, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 01:57:40'),
(17, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 01:57:46'),
(18, 'SETTINGS_UPDATE', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"theme\":\"light\",\"timestamp\":\"2025-01-21T01:58:52.962Z\"}', '2025-01-21 01:58:52'),
(19, 'SETTINGS_UPDATE', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"theme\":\"dark\",\"timestamp\":\"2025-01-21T01:58:55.264Z\"}', '2025-01-21 01:58:55'),
(20, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"4 minutes\"}', '2025-01-21 02:02:38'),
(21, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Failed to parse URL from /api/auth/check-security', '2025-01-21 02:02:46'),
(22, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Failed to parse URL from /api/auth/check-security', '2025-01-21 02:03:01'),
(23, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:07:57'),
(24, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"5 minutes\"}', '2025-01-21 02:13:49'),
(25, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:13:54'),
(26, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 02:13:56'),
(27, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:14:04'),
(28, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 02:14:55'),
(29, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:14:57'),
(30, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-21 02:15:02'),
(31, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:15:09'),
(32, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"3 minutes\"}', '2025-01-21 02:18:40'),
(33, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:18:51'),
(34, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 02:40:31'),
(35, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 02:40:32'),
(36, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 02:42:18'),
(37, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"27 minutes\"}', '2025-01-21 02:46:41'),
(38, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-21 02:46:54'),
(39, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 02:48:23'),
(40, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:45:27'),
(41, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:45:29'),
(42, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:45:32'),
(43, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:45:34'),
(44, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:48:21'),
(45, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:48:23'),
(46, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:48:28'),
(47, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 15:48:30'),
(48, 'PASSWORD_CHANGE', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 16:05:20'),
(49, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"5118 minutes\"}', '2025-01-24 16:05:23'),
(50, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_INVALID_PASSWORD', NULL, '2025-01-24 16:05:33'),
(51, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 16:05:38'),
(52, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"2 minutes\"}', '2025-01-24 16:08:11'),
(53, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_INVALID_PASSWORD', NULL, '2025-01-24 16:08:19'),
(54, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_INVALID_PASSWORD', NULL, '2025-01-24 16:10:08'),
(55, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 16:11:11'),
(56, 'PASSWORD_CHANGE', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 16:11:25'),
(57, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"0 minutes\"}', '2025-01-24 16:11:34'),
(58, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 16:12:21'),
(59, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"69 minutes\"}', '2025-01-24 17:21:58'),
(60, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 21:00:59'),
(61, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:19:54'),
(62, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:19:59'),
(63, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:20:00'),
(64, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:20:03'),
(65, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:20:03'),
(66, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:20:04'),
(67, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"19 minutes\"}', '2025-01-24 21:20:12'),
(68, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 21:24:59'),
(69, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:25:25'),
(70, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:34:55'),
(71, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:38:51'),
(72, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:00'),
(73, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:00'),
(74, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:01'),
(75, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:02'),
(76, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:17'),
(77, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"14 minutes\"}', '2025-01-24 21:39:24'),
(78, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-24 21:39:33'),
(79, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:50'),
(80, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-24 21:39:56'),
(81, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 00:43:35'),
(82, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 00:43:38'),
(83, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_INVALID_PASSWORD', NULL, '2025-01-25 00:53:34'),
(84, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 00:53:39'),
(85, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 00:53:55'),
(86, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 00:53:56'),
(87, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"2 minutes\"}', '2025-01-25 00:56:34'),
(88, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:20:09'),
(89, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:20:20'),
(90, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:20:25'),
(91, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:20:29'),
(92, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:21:24'),
(93, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:21:27'),
(94, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"1 minutes\"}', '2025-01-25 04:21:33'),
(95, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:22:03'),
(96, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Table \'orion_live.google_users\' doesn\'t exist', '2025-01-25 04:28:06'),
(97, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Table \'orion_live.google_users\' doesn\'t exist', '2025-01-25 04:28:15'),
(98, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Table \'orion_live.google_users\' doesn\'t exist', '2025-01-25 04:28:32'),
(99, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:29:42'),
(100, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:29:54'),
(101, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:30:09'),
(102, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:30:28'),
(103, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:31:35'),
(104, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:31:45'),
(105, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:34:43'),
(106, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:35:37'),
(107, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:35:45'),
(108, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:37:32'),
(109, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:38:08'),
(110, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:38:14'),
(111, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:38:19'),
(112, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:38:30'),
(113, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:38:34'),
(114, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"16 minutes\"}', '2025-01-25 04:38:43'),
(115, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:38:52'),
(116, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 04:39:01'),
(117, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:39:11'),
(118, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:39:15'),
(119, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"2 minutes\"}', '2025-01-25 04:42:08'),
(120, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:42:11'),
(121, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:42:39'),
(122, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:42:42'),
(123, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"1 minutes\"}', '2025-01-25 04:43:53'),
(124, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:43:57'),
(125, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:44:00'),
(126, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:44:03'),
(127, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"1 minutes\"}', '2025-01-25 04:45:07'),
(128, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:11'),
(129, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:45:15'),
(130, 'DEVICE_TRUSTED', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:18'),
(131, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:18'),
(132, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:45:20'),
(133, 'DEVICE_TRUSTED', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:23'),
(134, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:23'),
(135, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:45:26'),
(136, 'DEVICE_TRUSTED', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:30'),
(137, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:45:30'),
(138, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"0 minutes\"}', '2025-01-25 04:46:19'),
(139, 'DEVICE_TRUSTED', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:46:24'),
(140, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 04:46:24'),
(141, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"10 minutes\"}', '2025-01-25 04:56:35'),
(142, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Unknown column \'last_user_agent\' in \'field list\'', '2025-01-25 04:56:44'),
(143, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Unknown column \'last_user_agent\' in \'field list\'', '2025-01-25 04:56:48'),
(144, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_INVALID_PASSWORD', NULL, '2025-01-25 04:57:27'),
(145, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'Unknown column \'last_user_agent\' in \'field list\'', '2025-01-25 04:58:28'),
(146, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 05:00:26'),
(147, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"2 minutes\"}', '2025-01-25 05:02:47'),
(148, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'FAILED_SERVER_ERROR', 'You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near \'?\' at line 7', '2025-01-25 05:02:56'),
(149, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 05:03:26'),
(150, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:00:42'),
(151, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:00:43'),
(152, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:01:24'),
(153, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:01:26'),
(154, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"603 minutes\"}', '2025-01-25 15:06:33'),
(155, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 15:42:49'),
(156, 'LOGOUT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"credentials\",\"sessionDuration\":\"2 minutes\"}', '2025-01-25 15:45:06'),
(157, 'DEVICE_TRUSTED', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 15:46:34'),
(158, 'GOOGLE_LOGIN', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-25 15:46:34'),
(159, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:46:42'),
(160, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 15:46:45'),
(161, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:19:40'),
(162, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:20:08'),
(163, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:20:40'),
(164, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:21:51'),
(165, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:21:54'),
(166, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 20:22:29'),
(167, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:10:01'),
(168, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:10:06'),
(169, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:04'),
(170, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:05'),
(171, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:07'),
(172, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:08'),
(173, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:17'),
(174, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:17'),
(175, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:17'),
(176, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:18'),
(177, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:18'),
(178, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:11:32'),
(179, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:28:50'),
(180, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:28:51'),
(181, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:29:23'),
(182, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 22:29:24'),
(183, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 23:10:53'),
(184, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 23:10:54'),
(185, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 23:10:55'),
(186, 'SETTINGS_UPDATE_ATTEMPT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-25 23:10:55'),
(187, 'GOOGLE_LOGOUT', 'devulder.thomaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"provider\":\"google\",\"sessionDuration\":\"447 minutes\"}', '2025-01-25 23:14:27'),
(188, 'LOGIN_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', '{\"deviceId\":\"222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9\"}', '2025-01-26 14:34:37');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token` varchar(255) NOT NULL,
  `device_id` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `token`, `device_id`, `expires_at`, `created_at`, `ip_address`, `user_agent`) VALUES
(36, 1, 'b96db516026adb0052e0ba83aa6330a4ff11ca8078563f8e20e11ac88882bdd02e708ee0f972f71ed4147b85a438cbefd09315336297889f4a277a8d12e5aa97', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-02-25 14:34:37', '2025-01-26 14:34:37', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0');

-- --------------------------------------------------------

--
-- Structure de la table `session_durations`
--

CREATE TABLE `session_durations` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NULL DEFAULT NULL,
  `duration_seconds` int(11) NOT NULL,
  `type` enum('credentials','google') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `session_durations`
--

INSERT INTO `session_durations` (`id`, `user_id`, `start_time`, `end_time`, `duration_seconds`, `type`, `created_at`) VALUES
(1, 1, '2025-01-21 01:34:53', '2025-01-21 01:38:51', 238, 'credentials', '2025-01-21 01:38:51'),
(2, 2, '2025-01-21 01:41:13', '2025-01-21 01:45:19', 246, 'google', '2025-01-21 01:45:19'),
(3, 2, '2025-01-21 01:49:53', '2025-01-21 01:49:55', 2, 'google', '2025-01-21 01:49:55'),
(4, 2, '2025-01-21 01:51:33', '2025-01-21 01:52:00', 27, 'google', '2025-01-21 01:52:00'),
(5, 2, '2025-01-21 01:52:05', '2025-01-21 01:52:08', 3, 'google', '2025-01-21 01:52:08'),
(6, 2, '2025-01-21 01:57:31', '2025-01-21 01:57:40', 9, 'google', '2025-01-21 01:57:40'),
(7, 2, '2025-01-21 01:57:46', '2025-01-21 02:02:38', 292, 'google', '2025-01-21 02:02:38'),
(8, 1, '2025-01-21 02:07:57', '2025-01-21 02:13:49', 352, 'credentials', '2025-01-21 02:13:49'),
(9, 2, '2025-01-21 02:13:54', '2025-01-21 02:13:56', 2, 'google', '2025-01-21 02:13:56'),
(10, 1, '2025-01-21 02:14:04', '2025-01-21 02:14:55', 51, 'credentials', '2025-01-21 02:14:55'),
(11, 2, '2025-01-21 02:14:57', '2025-01-21 02:15:02', 5, 'google', '2025-01-21 02:15:02'),
(12, 1, '2025-01-21 02:15:09', '2025-01-21 02:18:40', 211, 'credentials', '2025-01-21 02:18:40'),
(13, 1, '2025-01-21 02:18:51', '2025-01-21 02:46:41', 1670, 'credentials', '2025-01-21 02:46:41'),
(14, 1, '2025-01-21 02:46:54', '2025-01-24 16:05:23', 307109, 'credentials', '2025-01-24 16:05:23'),
(15, 1, '2025-01-24 16:05:38', '2025-01-24 16:08:11', 153, 'credentials', '2025-01-24 16:08:11'),
(16, 1, '2025-01-24 16:11:11', '2025-01-24 16:11:34', 23, 'credentials', '2025-01-24 16:11:34'),
(17, 1, '2025-01-24 16:12:21', '2025-01-24 17:21:58', 4177, 'credentials', '2025-01-24 17:21:58'),
(18, 1, '2025-01-24 21:00:59', '2025-01-24 21:20:12', 1153, 'credentials', '2025-01-24 21:20:12'),
(19, 2, '2025-01-24 21:24:59', '2025-01-24 21:39:24', 865, 'google', '2025-01-24 21:39:24'),
(20, 2, '2025-01-25 00:43:35', '2025-01-25 00:43:38', 3, 'google', '2025-01-25 00:43:38'),
(21, 1, '2025-01-25 00:53:40', '2025-01-25 00:56:34', 174, 'credentials', '2025-01-25 00:56:34'),
(22, 1, '2025-01-25 04:20:10', '2025-01-25 04:21:33', 83, 'credentials', '2025-01-25 04:21:33'),
(23, 2, '2025-01-25 04:22:03', '2025-01-25 04:38:43', 1000, 'google', '2025-01-25 04:38:43'),
(24, 1, '2025-01-25 04:38:52', '2025-01-25 04:39:11', 19, 'credentials', '2025-01-25 04:39:11'),
(25, 2, '2025-01-25 04:39:15', '2025-01-25 04:42:08', 173, 'google', '2025-01-25 04:42:08'),
(26, 2, '2025-01-25 04:42:11', '2025-01-25 04:42:39', 28, 'google', '2025-01-25 04:42:39'),
(27, 2, '2025-01-25 04:42:42', '2025-01-25 04:43:53', 71, 'google', '2025-01-25 04:43:53'),
(28, 2, '2025-01-25 04:43:57', '2025-01-25 04:44:00', 3, 'google', '2025-01-25 04:44:00'),
(29, 2, '2025-01-25 04:44:03', '2025-01-25 04:45:07', 64, 'google', '2025-01-25 04:45:07'),
(30, 2, '2025-01-25 04:45:11', '2025-01-25 04:45:15', 4, 'google', '2025-01-25 04:45:15'),
(31, 2, '2025-01-25 04:45:18', '2025-01-25 04:45:20', 2, 'google', '2025-01-25 04:45:20'),
(32, 2, '2025-01-25 04:45:23', '2025-01-25 04:45:26', 3, 'google', '2025-01-25 04:45:26'),
(33, 2, '2025-01-25 04:45:30', '2025-01-25 04:46:19', 49, 'google', '2025-01-25 04:46:19'),
(34, 2, '2025-01-25 04:46:24', '2025-01-25 04:56:35', 611, 'google', '2025-01-25 04:56:35'),
(35, 1, '2025-01-25 05:00:26', '2025-01-25 05:02:47', 141, 'credentials', '2025-01-25 05:02:47'),
(36, 1, '2025-01-25 05:03:26', '2025-01-25 15:06:33', 36187, 'credentials', '2025-01-25 15:06:33'),
(37, 1, '2025-01-25 15:42:49', '2025-01-25 15:45:06', 137, 'credentials', '2025-01-25 15:45:06'),
(38, 2, '2025-01-25 15:46:34', '2025-01-25 23:14:27', 26873, 'google', '2025-01-25 23:14:27');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `lock_until` timestamp NULL DEFAULT NULL,
  `credits` int(11) DEFAULT 0,
  `rank` enum('free','pro','enterprise','admin') DEFAULT 'free',
  `last_ip` varchar(45) DEFAULT NULL,
  `last_user_agent` text DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_ip` varchar(45) DEFAULT NULL,
  `created_user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `google_id`, `created_at`, `last_login`, `failed_attempts`, `lock_until`, `credits`, `rank`, `last_ip`, `last_user_agent`, `deleted_at`, `updated_at`, `created_ip`, `created_user_agent`) VALUES
(1, 'tmoaspro@gmail.com', '$2a$12$s77/ksmnVOrok1Z7t.U77eTyG3N/dydnOGxGhfg2bX/kaihi7/EnS', NULL, '2025-01-21 01:34:46', '2025-01-26 14:34:37', 0, NULL, 1, 'free', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', NULL, '2025-01-26 14:34:37', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0'),
(2, 'devulder.thomaspro@gmail.com', NULL, '102633768900261938880', '2025-01-21 01:41:13', '2025-01-25 15:46:34', 0, NULL, 1, 'free', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', NULL, '2025-01-25 15:46:34', '::ffff:127.0.0.1', 'unknown');

-- --------------------------------------------------------

--
-- Structure de la table `user_alerts`
--

CREATE TABLE `user_alerts` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(50) NOT NULL,
  `severity` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL,
  `status` enum('PENDING','READ','DISMISSED') NOT NULL DEFAULT 'PENDING',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_devices`
--

CREATE TABLE `user_devices` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `device_id` varchar(64) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `last_ip` varchar(45) DEFAULT NULL,
  `is_trusted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `login_count` int(11) DEFAULT 0,
  `last_verified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_devices`
--

INSERT INTO `user_devices` (`id`, `user_id`, `device_id`, `user_agent`, `last_ip`, `is_trusted`, `created_at`, `updated_at`, `login_count`, `last_verified_at`) VALUES
(1, 1, '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '::ffff:127.0.0.1', 1, '2025-01-21 01:34:53', '2025-01-26 14:34:37', 4, NULL),
(3, 2, '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '::ffff:127.0.0.1', 1, '2025-01-21 01:57:31', '2025-01-25 15:46:34', 1, '2025-01-25 15:46:34');

-- --------------------------------------------------------

--
-- Structure de la table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `theme` varchar(10) DEFAULT 'dark',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notifications_report` tinyint(1) DEFAULT 1,
  `notifications_offers` tinyint(1) DEFAULT 1,
  `notifications_security` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `theme`, `created_at`, `updated_at`, `notifications_report`, `notifications_offers`, `notifications_security`) VALUES
(1, 1, 'dark', '2025-01-21 01:34:46', '2025-01-25 15:01:26', 1, 1, 1),
(2, 2, 'dark', '2025-01-21 01:41:13', '2025-01-25 23:10:55', 1, 1, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `login_info_temp`
--
ALTER TABLE `login_info_temp`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_used` (`used`);

--
-- Index pour la table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_token` (`token`),
  ADD KEY `password_resets_ibfk_1` (`user_id`);

--
-- Index pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `user_id_idx` (`user_id`),
  ADD KEY `first_name_idx` (`first_name`),
  ADD KEY `last_name_idx` (`last_name`);

--
-- Index pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `security_logs`
--
ALTER TABLE `security_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_email_type` (`email`,`type`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_sessions_token` (`token`),
  ADD KEY `sessions_ibfk_1` (`user_id`),
  ADD KEY `idx_device_id` (`device_id`);

--
-- Index pour la table `session_durations`
--
ALTER TABLE `session_durations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_start_time` (`start_time`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idx_google_id` (`google_id`),
  ADD KEY `idx_email` (`email`);

--
-- Index pour la table `user_alerts`
--
ALTER TABLE `user_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_alerts_ibfk_1` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created` (`created_at`);

--
-- Index pour la table `user_devices`
--
ALTER TABLE `user_devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_device_unique` (`user_id`,`device_id`),
  ADD KEY `idx_device_id` (`device_id`);

--
-- Index pour la table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `login_info_temp`
--
ALTER TABLE `login_info_temp`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `promo_codes`
--
ALTER TABLE `promo_codes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `security_logs`
--
ALTER TABLE `security_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `session_durations`
--
ALTER TABLE `session_durations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `user_alerts`
--
ALTER TABLE `user_alerts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_devices`
--
ALTER TABLE `user_devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `session_durations`
--
ALTER TABLE `session_durations`
  ADD CONSTRAINT `session_durations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_alerts`
--
ALTER TABLE `user_alerts`
  ADD CONSTRAINT `user_alerts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_devices`
--
ALTER TABLE `user_devices`
  ADD CONSTRAINT `user_devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

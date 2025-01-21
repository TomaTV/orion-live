-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 21 jan. 2025 à 03:58
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
(4, '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-01-21 02:14:56', 1);

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
(1, 1, 'Thomas', 'ORION', 'https://i.imgur.com/feQ5d0y.png', '2025-01-21 01:34:46', '2025-01-21 02:48:23'),
(2, 2, 'Thomas', 'Devulder', 'https://lh3.googleusercontent.com/a/ACg8ocIldDZ3_qbLD2JHvN0puP7JwOqw3lqmfAHyFvPiO7rGvL-OP7k4=s96-c', '2025-01-21 01:41:13', '2025-01-21 01:41:13');

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
(39, 'SETTINGS_UPDATE_ATTEMPT', 'tmoaspro@gmail.com', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', 'SUCCESS', NULL, '2025-01-21 02:48:23');

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
(10, 1, '57e707570542ef9fc6a0038c9b7f210b87a9151aeb314addd6e7c7e34dd2adf526ab6f0ad7509169336391cf5ebeb8ac36cb6a500e03d80bf18ee29b04c8b378', '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', '2025-02-20 02:46:54', '2025-01-21 02:46:54', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0');

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
(13, 1, '2025-01-21 02:18:51', '2025-01-21 02:46:41', 1670, 'credentials', '2025-01-21 02:46:41');

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
(1, 'tmoaspro@gmail.com', '$2a$12$aFiSnSMkEhbwiQ7nLszbautdsGAtHDUValQZpoHZ13z.5GuD/cgE2', NULL, '2025-01-21 01:34:46', '2025-01-21 02:46:54', 0, NULL, 1, 'free', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', NULL, '2025-01-21 02:46:54', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0'),
(2, 'devulder.thomaspro@gmail.com', NULL, '102633768900261938880', '2025-01-21 01:41:13', '2025-01-21 02:14:57', 0, NULL, 1, 'free', '::ffff:127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', NULL, '2025-01-21 02:14:57', '::ffff:127.0.0.1', 'unknown');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_devices`
--

INSERT INTO `user_devices` (`id`, `user_id`, `device_id`, `user_agent`, `last_ip`, `is_trusted`, `created_at`, `updated_at`) VALUES
(1, 1, '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '::ffff:127.0.0.1', 1, '2025-01-21 01:34:53', '2025-01-21 01:34:53'),
(2, 2, 'b23a6a8439c0dde5515893e7c90c1e3233b8616e634470f20dc4928bcf3609bc', 'unknown', '::ffff:127.0.0.1', 0, '2025-01-21 01:49:53', '2025-01-21 01:49:53'),
(3, 2, '222bb92af5102d5110f0e2e9fad99c71bc8cbb549e4c991968d86e76e630cca9', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0', '::ffff:127.0.0.1', 0, '2025-01-21 01:57:31', '2025-01-21 01:57:31');

-- --------------------------------------------------------

--
-- Structure de la table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `theme` varchar(10) DEFAULT 'dark',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `theme`, `created_at`, `updated_at`) VALUES
(1, 1, 'dark', '2025-01-21 01:34:46', '2025-01-21 02:40:32'),
(2, 2, 'dark', '2025-01-21 01:41:13', '2025-01-21 01:58:55');

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
  ADD UNIQUE KEY `user_id` (`user_id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `security_logs`
--
ALTER TABLE `security_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `session_durations`
--
ALTER TABLE `session_durations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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

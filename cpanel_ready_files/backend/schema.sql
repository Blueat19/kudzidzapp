CREATE DATABASE IF NOT EXISTS `tangakudzidza`;
USE `tangakudzidza`;

CREATE TABLE IF NOT EXISTS status_checks (
  id VARCHAR(64) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  timestamp DATETIME(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS progress (
  user_id VARCHAR(255) PRIMARY KEY,
  stars INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  letters_completed JSON NOT NULL,
  words_completed JSON NOT NULL,
  math_completed JSON NOT NULL,
  tracing_completed JSON NOT NULL,
  language VARCHAR(20) NOT NULL DEFAULT 'both',
  updated_at DATETIME(3) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

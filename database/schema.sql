-- GROUP22 · schéma MySQL 8 (Aiven). La fonction /api le crée aussi automatiquement au premier appel.
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,          -- bcrypt, jamais le mot de passe en clair
  display_name VARCHAR(120) NOT NULL DEFAULT '',
  groupe VARCHAR(40) NOT NULL DEFAULT '4IIR G22',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progress (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  data JSON NOT NULL,                            -- progression complète de l'étudiant
  updated_at DATETIME(3) NOT NULL,
  CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

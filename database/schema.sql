-- GROUP22 · schéma MySQL 8 (Aiven). La fonction /api le crée aussi automatiquement au premier appel.
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,          -- bcrypt, jamais le mot de passe en clair
  display_name VARCHAR(120) NOT NULL DEFAULT '',
  groupe VARCHAR(40) NOT NULL DEFAULT '4IIR G22',
  role VARCHAR(10) NOT NULL DEFAULT 'user',      -- 'admin' | 'user'
  status VARCHAR(10) NOT NULL DEFAULT 'pending', -- 'pending' (en attente) | 'approved' | 'blocked'
  session_id CHAR(36) NULL,                      -- une seule session active par compte
  last_seen DATETIME(3) NULL,
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

-- Documents ajoutés par l'admin (lien Drive / URL), ou modification d'un fichier intégré (ref = "module/fichier.pdf")
CREATE TABLE IF NOT EXISTS supports (
  id CHAR(36) NOT NULL PRIMARY KEY,
  ref VARCHAR(255) NULL,
  subject VARCHAR(40) NOT NULL,
  kind VARCHAR(20) NOT NULL DEFAULT 'cours',
  title VARCHAR(255) NOT NULL DEFAULT '',
  url VARCHAR(1000) NOT NULL DEFAULT '',
  sort INT NOT NULL DEFAULT 500,
  hidden TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY uq_supports_ref (ref)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS announcements (
  id CHAR(36) NOT NULL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  pinned TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

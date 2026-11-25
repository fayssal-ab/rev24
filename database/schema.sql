-- GROUP22 · schéma MySQL 8 (Aiven). La fonction /api le crée aussi automatiquement au premier appel.
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(100) NOT NULL,          -- bcrypt, jamais le mot de passe en clair
  display_name VARCHAR(120) NOT NULL DEFAULT '',
  groupe VARCHAR(40) NOT NULL DEFAULT '4IIR G22',
  role VARCHAR(10) NOT NULL DEFAULT 'user',      -- 'admin' | 'user'
  status VARCHAR(10) NOT NULL DEFAULT 'pending', -- 'pending' (en attente) | 'approved' | 'blocked'
  session_id CHAR(36) NULL,                      -- session partagée par les appareils du compte (remise à zéro par l'admin)
  last_seen DATETIME(3) NULL,                    -- dernière activité (mise à jour toutes les ~45 s quand l'onglet est ouvert)
  online_since DATETIME(3) NULL,                 -- début de la visite en cours (pour « en ligne depuis »)
  avatar MEDIUMTEXT NULL,                        -- photo de profil (data URL JPEG/PNG/WebP, redimensionnée dans le navigateur)
  avatar_at DATETIME(3) NULL,                    -- version de la photo (URL mise en cache)
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

-- Contrôles, examens et comptes rendus annoncés sur l'accueil (plusieurs par jour, tout module).
-- ends_at = heure de fin (ou fin de journée) en UTC ; la ligne est supprimée automatiquement une fois passée.
CREATE TABLE IF NOT EXISTS events (
  id CHAR(36) NOT NULL PRIMARY KEY,
  kind VARCHAR(10) NOT NULL DEFAULT 'controle',   -- 'controle' | 'examen' | 'cr' (compte rendu)
  module VARCHAR(20) NOT NULL,
  day CHAR(10) NOT NULL,                          -- AAAA-MM-JJ (affichage)
  time CHAR(5) NOT NULL DEFAULT '',               -- HH:MM ou vide
  ends_at DATETIME(3) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  KEY ix_events_ends (ends_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Discussion du groupe : seuls les 20 derniers messages sont gardés (les plus anciens sont supprimés à chaque envoi).
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  body VARCHAR(2000) NOT NULL,                    -- texte ; une mention est stockée @[Nom](id)
  poll JSON NULL,                                 -- sondage : { "options": [...] } (la question = body)
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_chat_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Votes des sondages du chat (un vote par membre, supprimés avec le message).
CREATE TABLE IF NOT EXISTS chat_votes (
  message_id BIGINT UNSIGNED NOT NULL,
  user_id CHAR(36) NOT NULL,
  choice TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (message_id, user_id),
  CONSTRAINT fk_vote_msg FOREIGN KEY (message_id) REFERENCES chat_messages (id) ON DELETE CASCADE,
  CONSTRAINT fk_vote_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

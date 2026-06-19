CREATE DATABASE IF NOT EXISTS `studio_assets`
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

USE `studio_assets`;

-- authors
CREATE TABLE `authors` (
  `author_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- categories
CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tags
CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(50) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- projects
CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `cover_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `project_url` varchar(500) DEFAULT NULL,
  `completed_at` date DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`project_id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- assets
CREATE TABLE `assets` (
  `asset_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `preview_url` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `code_snippet` text DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  `author_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `slug` (`slug`),
  CONSTRAINT `fk_assets_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`),
  CONSTRAINT `fk_assets_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `fk_assets_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- asset_tags
CREATE TABLE `asset_tags` (
  `asset_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`asset_id`, `tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `fk_asset_tags_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`),
  CONSTRAINT `fk_asset_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- users
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin') DEFAULT 'admin',
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- requests
CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  `status` enum('new','read','replied') DEFAULT 'new',
  `note` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- members
CREATE TABLE `members` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `members` (name, role) VALUES
  ('Paul', '工程師'),
  ('Oreo', '美術編輯'),
  ('Joseph', '總監');

-- meetings
CREATE TABLE `meetings` (
  `meeting_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `meeting_date` date NOT NULL,
  `attendees` varchar(500) DEFAULT NULL,
  `category` enum('專案討論','客戶會議','例行週會','腦力激盪','其他') DEFAULT '其他',
  `summary` text DEFAULT NULL,
  `decisions` text DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `status` enum('scheduled','done','cancelled') DEFAULT 'scheduled',
  `project_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`meeting_id`),
  CONSTRAINT `fk_meetings_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- meeting_notes
CREATE TABLE `meeting_notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `speaker_name` varchar(100) DEFAULT NULL,
  `content` text NOT NULL,
  `note_type` enum('發言','決議','待辦','備注') DEFAULT '發言',
  `created_at` timestamp DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`note_id`),
  CONSTRAINT `fk_notes_meeting` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`),
  CONSTRAINT `fk_notes_member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- action_items
CREATE TABLE `action_items` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_id` int(11) NOT NULL,
  `assignee_id` int(11) DEFAULT NULL,
  `assignee_name` varchar(100) DEFAULT NULL,
  `content` varchar(500) NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('未開始','進行中','已完成','已取消') DEFAULT '未開始',
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`action_id`),
  CONSTRAINT `fk_actions_meeting` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`),
  CONSTRAINT `fk_actions_member` FOREIGN KEY (`assignee_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- meeting_assets
CREATE TABLE `meeting_assets` (
  `meeting_id` int(11) NOT NULL,
  `asset_id` int(11) NOT NULL,
  PRIMARY KEY (`meeting_id`, `asset_id`),
  CONSTRAINT `fk_ma_meeting` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`),
  CONSTRAINT `fk_ma_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- clients
CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) DEFAULT NULL,
  `contact_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `assigned_member_id` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` enum('active','maintaining','ended') DEFAULT 'active',
  `maintain_items` varchar(500) DEFAULT NULL,
  `maintain_fee` varchar(100) DEFAULT NULL,
  `maintain_until` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `email` (`email`),
  CONSTRAINT `fk_clients_member` FOREIGN KEY (`assigned_member_id`) REFERENCES `members` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- api_products
CREATE TABLE `api_products` (
  `api_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_url` varchar(500) DEFAULT NULL,
  `request_example` text DEFAULT NULL,
  `response_example` text DEFAULT NULL,
  `endpoint_url` varchar(500) DEFAULT NULL,
  `method` enum('GET','POST','PUT','DELETE') DEFAULT NULL,
  `auth_type` varchar(100) DEFAULT NULL,
  `price` varchar(100) DEFAULT '待決定',
  `internal_note` text DEFAULT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`api_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- api_product_tags
CREATE TABLE `api_product_tags` (
  `api_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`api_id`, `tag_id`),
  CONSTRAINT `fk_apt_api` FOREIGN KEY (`api_id`) REFERENCES `api_products` (`api_id`),
  CONSTRAINT `fk_apt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ideas
CREATE TABLE `ideas` (
  `idea_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `status` enum('新點子','討論中','已採用','已放棄') DEFAULT '新點子',
  `submitted_by` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `meeting_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  `updated_at` timestamp DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`idea_id`),
  CONSTRAINT `fk_ideas_member` FOREIGN KEY (`submitted_by`) REFERENCES `members` (`member_id`),
  CONSTRAINT `fk_ideas_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`),
  CONSTRAINT `fk_ideas_meeting` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`meeting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- idea_tags
CREATE TABLE `idea_tags` (
  `idea_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`idea_id`, `tag_id`),
  CONSTRAINT `fk_it_idea` FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`idea_id`),
  CONSTRAINT `fk_it_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- activity_logs
CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(100) NOT NULL,
  `action` varchar(50) NOT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT current_timestamp(),
  `note` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
DROP DATABASE IF EXISTS iq_test;
CREATE DATABASE iq_test
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE iq_test;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT '0.00',
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- TESTS (METADATA)
-- =========================
CREATE TABLE tests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT NULL,
  published TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- QUESTIONS
-- =========================
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_id INT NOT NULL,
  question_text TEXT NOT NULL,
  image_url VARCHAR(500),
  question_type ENUM('multiple_choice','short_answer','numeric')
    NOT NULL DEFAULT 'multiple_choice',
  correct_answer VARCHAR(255),
  question_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_questions_test
    FOREIGN KEY (test_id)
    REFERENCES tests(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- QUESTION IMAGES
-- =========================
CREATE TABLE question_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_qimages_question
    FOREIGN KEY (question_id)
    REFERENCES questions(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- QUESTION OPTIONS
-- =========================
CREATE TABLE question_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  label VARCHAR(32),
  option_text VARCHAR(500) NULL,
  image_url VARCHAR(500) NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_qopts_question
    FOREIGN KEY (question_id)
    REFERENCES questions(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- TEST RESULTS
-- =========================
CREATE TABLE test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  test_id INT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  iq_score INT NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_results_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_results_test
    FOREIGN KEY (test_id)
    REFERENCES tests(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- USER ANSWERS
-- =========================
CREATE TABLE user_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  test_result_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_option_id INT NULL,
  answer_text VARCHAR(255),
  is_correct TINYINT(1) NOT NULL,
  CONSTRAINT fk_answers_result
    FOREIGN KEY (test_result_id)
    REFERENCES test_results(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_answers_question
    FOREIGN KEY (question_id)
    REFERENCES questions(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_answers_option
    FOREIGN KEY (selected_option_id)
    REFERENCES question_options(id)
) ENGINE=InnoDB;

-- =========================
-- TRANSACTIONS (SAFE)
-- =========================
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tx_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_tx_receiver
    FOREIGN KEY (receiver_id)
    REFERENCES users(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;


ALTER TABLE questions MODIFY question_type
ENUM('multiple_choice', 'short_answer', 'numeric', 'grid')
NOT NULL DEFAULT 'multiple_choice';

ALTER TABLE questions ADD COLUMN grid_data TEXT;
ALTER TABLE questions MODIFY question_type ENUM('multiple_choice', 'short_answer', 'numeric', 'grid') NOT NULL DEFAULT 'multiple_choice';
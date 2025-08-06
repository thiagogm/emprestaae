-- Schema do banco de dados para o app "Empresta aê"
-- Execute este arquivo no MySQL para criar todas as tabelas

USE empresta_ae;

-- Tabela de usuários
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  phone VARCHAR(20),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email),
  INDEX idx_verified (verified)
);

-- Tabela de categorias
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  icon VARCHAR(50),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens
CREATE TABLE items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  period ENUM('hora', 'dia', 'semana', 'mes'),
  status ENUM('available', 'borrowed', 'unavailable') DEFAULT 'available',
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,

  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_location (location_lat, location_lng),
  INDEX idx_created_at (created_at)
);

-- Tabela de imagens dos itens
CREATE TABLE item_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,

  INDEX idx_item_id (item_id),
  INDEX idx_is_primary (is_primary)
);

-- Tabela de empréstimos
CREATE TABLE loans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_id INT NOT NULL,
  borrower_id INT NOT NULL,
  lender_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lender_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_item_id (item_id),
  INDEX idx_borrower_id (borrower_id),
  INDEX idx_lender_id (lender_id),
  INDEX idx_status (status),
  INDEX idx_dates (start_date, end_date)
);

-- Tabela de avaliações
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loan_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewed_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_loan_id (loan_id),
  INDEX idx_reviewer_id (reviewer_id),
  INDEX idx_reviewed_id (reviewed_id),
  INDEX idx_rating (rating)
);

-- Tabela de mensagens
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loan_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_loan_id (loan_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at)
);

-- Inserir categorias padrão
INSERT INTO categories (name, icon, color) VALUES
('Ferramentas', 'wrench', '#3B82F6'),
('Eletrônicos', 'laptop', '#10B981'),
('Esportes', 'bicycle', '#F59E0B'),
('Casa', 'home', '#8B5CF6'),
('Livros', 'book', '#EF4444'),
('Outros', 'package', '#6B7280');

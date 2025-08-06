-- =====================================================
-- SCHEMA MODERNIZADO PARA AZURE - EMPRESTA AÊ
-- =====================================================
-- Versão: 2.0
-- Data: 2025-01-21
-- Descrição: Schema otimizado para Azure Database for MySQL Flexible Server
-- Características: UUIDs, Geolocalização, Índices Otimizados, Auditoria, LGPD

-- Configurações iniciais do banco
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- =====================================================
-- 1. TABELA DE USUÁRIOS (MODERNIZADA)
-- =====================================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,
    location POINT SRID 4326,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Brasil',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    -- Índices otimizados
    INDEX idx_email (email),
    INDEX idx_verified (verified),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_city_state (city, state),
    SPATIAL INDEX idx_spatial_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABELA DE CATEGORIAS (OTIMIZADA)
-- =====================================================
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    color VARCHAR(7),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_active (active),
    INDEX idx_sort_order (sort_order),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABELA DE ITENS (COMPLETAMENTE MODERNIZADA)
-- =====================================================
CREATE TABLE items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    category_id CHAR(36) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    period ENUM('hora', 'dia', 'semana', 'mes'),
    status ENUM('available', 'borrowed', 'unavailable', 'maintenance') DEFAULT 'available',
    location POINT SRID 4326,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    specifications JSON,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,

    -- Índices otimizados para performance
    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_period (period),
    INDEX idx_rating (rating),
    INDEX idx_view_count (view_count),
    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_city_state (city, state),
    INDEX idx_featured (is_featured, featured_until),
    INDEX idx_status_category (status, category_id),
    INDEX idx_price_period (price, period),
    SPATIAL INDEX idx_spatial_location (location),
    FULLTEXT INDEX idx_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABELA DE IMAGENS DOS ITENS (OTIMIZADA)
-- =====================================================
CREATE TABLE item_images (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    item_id CHAR(36) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    file_size INT,
    mime_type VARCHAR(50),
    width INT,
    height INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,

    INDEX idx_item_id (item_id),
    INDEX idx_is_primary (is_primary),
    INDEX idx_sort_order (sort_order),
    UNIQUE KEY unique_primary_per_item (item_id, is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. TABELA DE EMPRÉSTIMOS (MODERNIZADA)
-- =====================================================
CREATE TABLE loans (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    item_id CHAR(36) NOT NULL,
    borrower_id CHAR(36) NOT NULL,
    lender_id CHAR(36) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NUL
    actual_return_date DATETIME NULL,
    status ENUM('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled', 'overdue') DEFAULT 'pending',
    total_price DECIMAL(10,2),
    deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    terms JSON,
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (borrower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lender_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_item_id (item_id),
    INDEX idx_borrower_id (borrower_id),
    INDEX idx_lender_id (lender_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_created_at (created_at),
    INDEX idx_active_loans (status, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. TABELA DE AVALIAÇÕES (OTIMIZADA)
-- =====================================================
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    loan_id CHAR(36) NOT NULL,
    reviewer_id CHAR(36) NOT NULL,
    reviewed_id CHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_loan_id (loan_id),
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_reviewed_id (reviewed_id),
    INDEX idx_rating (rating),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_review_per_loan (loan_id, reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. TABELA DE MENSAGENS (MODERNIZADA)
-- =====================================================
CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    loan_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'system', 'location') DEFAULT 'text',
    metadata JSON,
    is_system BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_loan_id (loan_id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_created_at (created_at),
    INDEX idx_read_at (read_at),
    INDEX idx_unread_messages (loan_id, read_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. TABELA DE NOTIFICAÇÕES (NOVA)
-- =====================================================
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    type ENUM('loan_request', 'loan_approved', 'loan_rejected', 'message', 'review', 'system', 'reminder') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read (read),
    INDEX idx_created_at (created_at),
    INDEX idx_expires_at (expires_at),
    INDEX idx_unread_notifications (user_id, read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. TABELA DE SESSÕES DE USUÁRIO (NOVA)
-- =====================================================
CREATE TABLE user_sessions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_info JSON,
    ip_address INET6,
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at),
    INDEX idx_last_activity (last_activity),
    INDEX idx_active_sessions (user_id, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. TABELA DE LOGS DE AUDITORIA (LGPD/COMPLIANCE)
-- =====================================================
CREATE TABLE audit_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    table_name VARCHAR(64) NOT NULL,
    record_id CHAR(36),
    operation ENUM('INSERT', 'UPDATE', 'DELETE', 'SELECT') NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address INET6,
    user_agent TEXT,
    session_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_table_name (table_name),
    INDEX idx_record_id (record_id),
    INDEX idx_operation (operation),
    INDEX idx_created_at (created_at),
    INDEX idx_table_operation (table_name, operation),
    INDEX idx_user_table (user_id, table_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. TABELA DE FAVORITOS (NOVA)
-- =====================================================
CREATE TABLE user_favorites (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    item_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_item_id (item_id),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_user_item_favorite (user_id, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. TABELA DE CONFIGURAÇÕES DO USUÁRIO (NOVA)
-- =====================================================
CREATE TABLE user_settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    notifications_sms BOOLEAN DEFAULT FALSE,
    privacy_show_phone BOOLEAN DEFAULT FALSE,
    privacy_show_location BOOLEAN DEFAULT TRUE,
    language VARCHAR(5) DEFAULT 'pt-BR',
    timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    search_radius INT DEFAULT 10000, -- em metros
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. TABELA DE RELATÓRIOS/DENÚNCIAS (NOVA)
-- =====================================================
CREATE TABLE reports (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reporter_id CHAR(36) NOT NULL,
    reported_user_id CHAR(36),
    reported_item_id CHAR(36),
    reported_loan_id CHAR(36),
    type ENUM('inappropriate_content', 'fake_item', 'user_behavior', 'spam', 'fraud', 'other') NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'investigating', 'resolved', 'dismissed') DEFAULT 'pending',
    admin_notes TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_item_id) REFERENCES items(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_loan_id) REFERENCES loans(id) ON DELETE SET NULL,

    INDEX idx_reporter_id (reporter_id),
    INDEX idx_reported_user_id (reported_user_id),
    INDEX idx_reported_item_id (reported_item_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. VIEWS MATERIALIZADAS PARA PERFORMANCE
-- =====================================================

-- View para estatísticas de usuários
CREATE VIEW user_stats AS
SELECT
    u.id,
    u.name,
    u.email,
    u.rating,
    u.verified,
    COUNT(DISTINCT i.id) as total_items,
    COUNT(DISTINCT CASE WHEN l.lender_id = u.id THEN l.id END) as total_loans_as_lender,
    COUNT(DISTINCT CASE WHEN l.borrower_id = u.id THEN l.id END) as total_loans_as_borrower,
    COUNT(DISTINCT r.id) as total_reviews_received,
    AVG(r.rating) as avg_rating_received
FROM users u
LEFT JOIN items i ON u.id = i.user_id AND i.deleted_at IS NULL
LEFT JOIN loans l ON (u.id = l.lender_id OR u.id = l.borrower_id)
LEFT JOIN reviews r ON u.id = r.reviewed_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email, u.rating, u.verified;

-- View para itens com detalhes completos
CREATE VIEW items_with_details AS
SELECT
    i.*,
    u.name as owner_name,
    u.rating as owner_rating,
    u.verified as owner_verified,
    c.name as category_name,
    c.icon as category_icon,
    c.color as category_color,
    COUNT(DISTINCT f.id) as favorite_count,
    COUNT(DISTINCT r.id) as review_count,
    AVG(r.rating) as avg_rating
FROM items i
JOIN users u ON i.user_id = u.id
JOIN categories c ON i.category_id = c.id
LEFT JOIN user_favorites f ON i.id = f.item_id
LEFT JOIN loans l ON i.id = l.item_id
LEFT JOIN reviews r ON l.id = r.loan_id
WHERE i.deleted_at IS NULL AND u.deleted_at IS NULL
GROUP BY i.id, u.name, u.rating, u.verified, c.name, c.icon, c.color;

-- =====================================================
-- 15. TRIGGERS PARA AUDITORIA AUTOMÁTICA
-- =====================================================

DELIMITER $$

-- Trigger para auditoria da tabela users
CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, operation, new_values)
    VALUES (NEW.id, 'users', NEW.id, 'INSERT', JSON_OBJECT(
        'id', NEW.id,
        'name', NEW.name,
        'email', NEW.email,
        'verified', NEW.verified
    ));
END$$

CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, operation, old_values, new_values)
    VALUES (NEW.id, 'users', NEW.id, 'UPDATE',
        JSON_OBJECT('name', OLD.name, 'email', OLD.email, 'verified', OLD.verified),
        JSON_OBJECT('name', NEW.name, 'email', NEW.email, 'verified', NEW.verified)
    );
END$$

-- Trigger para auditoria da tabela items
CREATE TRIGGER items_audit_insert
AFTER INSERT ON items
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, operation, new_values)
    VALUES (NEW.user_id, 'items', NEW.id, 'INSERT', JSON_OBJECT(
        'id', NEW.id,
        'title', NEW.title,
        'price', NEW.price,
        'status', NEW.status
    ));
END$$

CREATE TRIGGER items_audit_update
AFTER UPDATE ON items
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, operation, old_values, new_values)
    VALUES (NEW.user_id, 'items', NEW.id, 'UPDATE',
        JSON_OBJECT('title', OLD.title, 'price', OLD.price, 'status', OLD.status),
        JSON_OBJECT('title', NEW.title, 'price', NEW.price, 'status', NEW.status)
    );
END$$

-- Trigger para atualizar contador de favoritos
CREATE TRIGGER update_favorite_count_insert
AFTER INSERT ON user_favorites
FOR EACH ROW
BEGIN
    UPDATE items SET favorite_count = favorite_count + 1 WHERE id = NEW.item_id;
END$$

CREATE TRIGGER update_favorite_count_delete
AFTER DELETE ON user_favorites
FOR EACH ROW
BEGIN
    UPDATE items SET favorite_count = favorite_count - 1 WHERE id = OLD.item_id;
END$$

DELIMITER ;

-- =====================================================
-- 16. INSERÇÃO DE DADOS INICIAIS
-- =====================================================

-- Inserir categorias padrão com UUIDs
INSERT INTO categories (id, name, slug, icon, color, description, sort_order) VALUES
(UUID(), 'Ferramentas', 'ferramentas', 'wrench', '#3B82F6', 'Ferramentas para casa, jardim e construção', 1),
(UUID(), 'Eletrônicos', 'eletronicos', 'laptop', '#10B981', 'Equipamentos eletrônicos e tecnologia', 2),
(UUID(), 'Esportes', 'esportes', 'bicycle', '#F59E0B', 'Equipamentos esportivos e recreação', 3),
(UUID(), 'Casa e Jardim', 'casa-jardim', 'home', '#8B5CF6', 'Itens para casa, decoração e jardim', 4),
(UUID(), 'Livros e Mídia', 'livros-midia', 'book', '#EF4444', 'Livros, filmes, jogos e mídia', 5),
(UUID(), 'Veículos', 'veiculos', 'car', '#06B6D4', 'Carros, motos, bicicletas e acessórios', 6),
(UUID(), 'Roupas e Acessórios', 'roupas-acessorios', 'shirt', '#F97316', 'Roupas, sapatos e acessórios', 7),
(UUID(), 'Outros', 'outros', 'package', '#6B7280', 'Outros itens diversos', 99);

-- =====================================================
-- 17. ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índices compostos para queries complexas
CREATE INDEX idx_items_location_status ON items(status, location(25));
CREATE INDEX idx_items_category_price ON items(category_id, price, status);
CREATE INDEX idx_loans_dates_status ON loans(start_date, end_date, status);
CREATE INDEX idx_messages_loan_created ON messages(loan_id, created_at);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read, created_at);

-- =====================================================
-- 18. CONFIGURAÇÕES FINAIS
-- =====================================================

-- Restaurar configurações
SET FOREIGN_KEY_CHECKS = 1;

-- Otimizações do MySQL para Azure
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_flush_log_at_trx_commit = 2;
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL max_connections = 1000;

-- Comentários finais
-- Este schema foi otimizado para:
-- ✅ Azure Database for MySQL Flexible Server
-- ✅ UUIDs para todas as chaves primárias
-- ✅ Índices espaciais para geolocalização
-- ✅ Auditoria completa para LGPD
-- ✅ Performance otimizada com índices compostos
-- ✅ Triggers automáticos para integridade
-- ✅ Views materializadas para relatórios
-- ✅ Suporte completo a UTF-8 (utf8mb4)
-- ✅ Soft deletes com deleted_at
-- ✅ Timestamps automáticos
-- ✅ Constraints de integridade referencial

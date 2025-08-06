-- =====================================================
-- CONFIGURAÇÕES ESPECÍFICAS PARA AZURE DATABASE FOR MYSQL
-- =====================================================
-- Versão: 2.0
-- Data: 2025-01-21
-- Descrição: Configurações otimizadas para Azure Database for MySQL Flexible Server

-- =====================================================
-- 1. CONFIGURAÇÕES DE SEGURANÇA
-- =====================================================

-- Forçar SSL/TLS para todas as conexões
SET GLOBAL require_secure_transport = ON;

-- Configurações de autenticação
SET GLOBAL validate_password.policy = MEDIUM;
SET GLOBAL validate_password.length = 12;
SET GLOBAL validate_password.mixed_case_count = 1;
SET GLOBAL validate_password.number_count = 1;
SET GLOBAL validate_password.special_char_count = 1;

-- =====================================================
-- 2. CONFIGURAÇÕES DE PERFORMANCE
-- =====================================================

-- Configuraçexão
SET GLOBAL max_connections = 1000;
SET GLOBAL max_user_connections = 50;
SET GLOBAL connect_timeout = 10;
SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;

-- Configurações do InnoDB
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB (ajustar conforme RAM disponível)
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_log_buffer_size = 16777216; -- 16MB
SET GLOBAL innodb_flush_log_at_trx_commit = 2; -- Performance vs Durabilidade
SET GLOBAL innodb_flush_method = 'O_DIRECT';
SET GLOBAL innodb_file_per_table = ON;
SET GLOBAL innodb_open_files = 2000;

-- Configurações de Query Cache (se disponível)
SET GLOBAL query_cache_type = ON;
SET GLOBAL query_cache_size = 67108864; -- 64MB

-- Configurações de Thread
SET GLOBAL thread_cache_size = 50;
SET GLOBAL table_open_cache = 2000;

-- =====================================================
-- 3. CONFIGURAÇÕES DE CHARSET E COLLATION
-- =====================================================

-- Definir charset padrão para UTF-8 completo
SET GLOBAL character_set_server = 'utf8mb4';
SET GLOBAL collation_server = 'utf8mb4_unicode_ci';

-- Configurações de charset para conexões
SET GLOBAL character_set_client = 'utf8mb4';
SET GLOBAL character_set_connection = 'utf8mb4';
SET GLOBAL character_set_results = 'utf8mb4';

-- =====================================================
-- 4. CONFIGURAÇÕES DE LOGGING E AUDITORIA
-- =====================================================

-- Habilitar logs de queries lentas
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 2.0; -- Queries > 2 segundos
SET GLOBAL log_queries_not_using_indexes = ON;

-- Configurações de log geral (usar com cuidado em produção)
-- SET GLOBAL general_log = ON;

-- Configurações de log de erro
SET GLOBAL log_error_verbosity = 2;

-- =====================================================
-- 5. CONFIGURAÇÕES ESPECÍFICAS PARA GEOLOCALIZAÇÃO
-- =====================================================

-- Habilitar funções espaciais
SET GLOBAL spatial_index_enabled = ON;

-- Configurações para performance de queries espaciais
SET GLOBAL optimizer_switch = 'use_index_extensions=on';

-- =====================================================
-- 6. USUÁRIOS E PERMISSÕES
-- =====================================================

-- Criar usuário para aplicação (executar com privilégios administrativos)
-- IMPORTANTE: Substituir 'SENHA_SEGURA' por uma senha forte real

-- Usuário principal da aplicação
CREATE USER IF NOT EXISTS 'empresta_app'@'%' IDENTIFIED BY 'SENHA_SEGURA_APP';
GRANT SELECT, INSERT, UPDATE, DELETE ON empresta_ae.* TO 'empresta_app'@'%';
GRANT EXECUTE ON empresta_ae.* TO 'empresta_app'@'%';

-- Usuário para leitura (read replicas)
CREATE USER IF NOT EXISTS 'empresta_read'@'%' IDENTIFIED BY 'SENHA_SEGURA_READ';
GRANT SELECT ON empresta_ae.* TO 'empresta_read'@'%';

-- Usuário para backups
CREATE USER IF NOT EXISTS 'empresta_backup'@'%' IDENTIFIED BY 'SENHA_SEGURA_BACKUP';
GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON empresta_ae.* TO 'empresta_backup'@'%';

-- Usuário para monitoramento
CREATE USER IF NOT EXISTS 'empresta_monitor'@'%' IDENTIFIED BY 'SENHA_SEGURA_MONITOR';
GRANT SELECT ON performance_schema.* TO 'empresta_monitor'@'%';
GRANT SELECT ON information_schema.* TO 'empresta_monitor'@'%';
GRANT PROCESS ON *.* TO 'empresta_monitor'@'%';

-- Aplicar as permissões
FLUSH PRIVILEGES;

-- =====================================================
-- 7. CONFIGURAÇÕES DE TIMEZONE
-- =====================================================

-- Definir timezone padrão para Brasil
SET GLOBAL time_zone = '-03:00';

-- =====================================================
-- 8. STORED PROCEDURES PARA MANUTENÇÃO
-- =====================================================

DELIMITER $$

-- Procedure para limpeza de sessões expiradas
CREATE PROCEDURE CleanExpiredSessions()
BEGIN
    DELETE FROM user_sessions
    WHERE expires_at < NOW();

    SELECT ROW_COUNT() as sessions_cleaned;
END$$

-- Procedure para limpeza de notificações antigas
CREATE PROCEDURE CleanOldNotifications()
BEGIN
    DELETE FROM notifications
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
    AND read = TRUE;

    SELECT ROW_COUNT() as notifications_cleaned;
END$$

-- Procedure para atualizar estatísticas de usuários
CREATE PROCEDURE UpdateUserStats()
BEGIN
    UPDATE users u
    SET rating = (
        SELECT COALESCE(AVG(r.rating), 0)
        FROM reviews r
        WHERE r.reviewed_id = u.id
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM reviews r
        WHERE r.reviewed_id = u.id
    )
    WHERE u.deleted_at IS NULL;

    SELECT ROW_COUNT() as users_updated;
END$$

-- Procedure para limpeza de logs de auditoria antigos
CREATE PROCEDURE CleanOldAuditLogs()
BEGIN
    DELETE FROM audit_logs
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);

    SELECT ROW_COUNT() as audit_logs_cleaned;
END$$

-- Function para calcular distância entre dois pontos
CREATE FUNCTION CalculateDistance(lat1 DECIMAL(10,8), lng1 DECIMAL(11,8), lat2 DECIMAL(10,8), lng2 DECIMAL(11,8))
RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE distance DECIMAL(10,2);
    SET distance = (
        6371 * ACOS(
            COS(RADIANS(lat1)) *
            COS(RADIANS(lat2)) *
            COS(RADIANS(lng2) - RADIANS(lng1)) +
            SIN(RADIANS(lat1)) *
            SIN(RADIANS(lat2))
        )
    );
    RETURN distance;
END$$

DELIMITER ;

-- =====================================================
-- 9. EVENTOS PARA MANUTENÇÃO AUTOMÁTICA
-- =====================================================

-- Habilitar event scheduler
SET GLOBAL event_scheduler = ON;

-- Evento para limpeza diária de sessões expiradas
CREATE EVENT IF NOT EXISTS daily_session_cleanup
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanExpiredSessions();

-- Evento para limpeza semanal de notificações antigas
CREATE EVENT IF NOT EXISTS weekly_notification_cleanup
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanOldNotifications();

-- Evento para atualização diária de estatísticas
CREATE EVENT IF NOT EXISTS daily_stats_update
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL UpdateUserStats();

-- Evento para limpeza mensal de logs de auditoria
CREATE EVENT IF NOT EXISTS monthly_audit_cleanup
ON SCHEDULE EVERY 1 MONTH
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanOldAuditLogs();

-- =====================================================
-- 10. CONFIGURAÇÕES DE BACKUP E RECOVERY
-- =====================================================

-- Configurações para backup consistente
SET GLOBAL innodb_fast_shutdown = 0;
SET GLOBAL innodb_flush_log_at_trx_commit = 1;

-- =====================================================
-- 11. QUERIES DE MONITORAMENTO
-- =====================================================

-- Query para monitorar performance de queries
CREATE VIEW slow_queries_summary AS
SELECT
    DIGEST_TEXT as query_pattern,
    COUNT_STAR as exec_count,
    AVG_TIMER_WAIT/1000000000000 as avg_time_sec,
    MAX_TIMER_WAIT/1000000000000 as max_time_sec,
    SUM_ROWS_EXAMINED as total_rows_examined,
    SUM_ROWS_SENT as total_rows_sent
FROM performance_schema.events_statements_summary_by_digest
WHERE AVG_TIMER_WAIT > 2000000000000 -- > 2 segundos
ORDER BY AVG_TIMER_WAIT DESC;

-- Query para monitorar conexões ativas
CREATE VIEW active_connections AS
SELECT
    ID,
    USER,
    HOST,
    DB,
    COMMAND,
    TIME,
    STATE,
    INFO
FROM information_schema.PROCESSLIST
WHERE COMMAND != 'Sleep'
ORDER BY TIME DESC;

-- =====================================================
-- 12. CONFIGURAÇÕES DE REPLICAÇÃO (PARA READ REPLICAS)
-- =====================================================

-- Configurações para servidor primário
SET GLOBAL server_id = 1;
SET GLOBAL log_bin = ON;
SET GLOBAL binlog_format = 'ROW';
SET GLOBAL binlog_row_image = 'FULL';
SET GLOBAL sync_binlog = 1;

-- Configurações para réplicas (executar nas réplicas)
-- SET GLOBAL read_only = ON;
-- SET GLOBAL super_read_only = ON;
-- SET GLOBAL relay_log_recovery = ON;

-- =====================================================
-- 13. CONFIGURAÇÕES DE CACHE
-- =====================================================

-- Configurações para cache de tabelas
SET GLOBAL table_open_cache = 4000;
SET GLOBAL table_definition_cache = 2000;

-- Configurações para cache de threads
SET GLOBAL thread_cache_size = 100;

-- =====================================================
-- 14. CONFIGURAÇÕES FINAIS DE OTIMIZAÇÃO
-- =====================================================

-- Configurações para sort e join
SET GLOBAL sort_buffer_size = 2097152; -- 2MB
SET GLOBAL join_buffer_size = 2097152; -- 2MB
SET GLOBAL read_buffer_size = 131072; -- 128KB
SET GLOBAL read_rnd_buffer_size = 262144; -- 256KB

-- Configurações para MyISAM (se usado)
SET GLOBAL key_buffer_size = 134217728; -- 128MB

-- Configurações para temporary tables
SET GLOBAL tmp_table_size = 67108864; -- 64MB
SET GLOBAL max_heap_table_size = 67108864; -- 64MB

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Ajustar os valores de buffer_pool_size conforme RAM disponível
-- 2. Monitorar performance após aplicar configurações
-- 3. Testar em ambiente de desenvolvimento primeiro
-- 4. Fazer backup antes de aplicar em produção
-- 5. Algumas configurações podem requerer reinicialização do servidor
-- 6. Senhas devem ser alteradas para valores seguros
-- 7. Configurações de SSL/TLS são obrigatórias no Azure
-- 8. Monitorar logs após aplicar configurações

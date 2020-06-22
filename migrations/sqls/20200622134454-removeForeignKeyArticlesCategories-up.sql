/* Replace with your SQL commands */

ALTER TABLE `articles` 
DROP FOREIGN KEY `fk_articles_1`;
ALTER TABLE `articles` 
DROP INDEX `fk_articles_1_idx`;
ALTER TABLE `articles` 
DROP FOREIGN KEY `fk_users_2`;
ALTER TABLE `articles` 
DROP INDEX `fk_articles_2_idx`;

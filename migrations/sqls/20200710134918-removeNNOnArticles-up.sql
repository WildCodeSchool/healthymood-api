ALTER TABLE `articles` 
CHANGE COLUMN `title` `title` VARCHAR(150) NULL ,
CHANGE COLUMN `slug` `slug` VARCHAR(200) NULL ,
CHANGE COLUMN `content` `content` LONGTEXT NULL ,
CHANGE COLUMN `image` `image` VARCHAR(200) NULL ,
CHANGE COLUMN `created_at` `created_at` DATETIME NULL ,
CHANGE COLUMN `user_id` `user_id` INT(11) NULL ;

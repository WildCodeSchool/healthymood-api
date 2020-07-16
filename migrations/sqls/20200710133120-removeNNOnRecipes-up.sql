ALTER TABLE `recipes` 
CHANGE COLUMN `name` `name` VARCHAR(150) NULL ,
CHANGE COLUMN `image` `image` VARCHAR(200) NULL ,
CHANGE COLUMN `content` `content` LONGTEXT NULL ,
CHANGE COLUMN `created_at` `created_at` DATETIME NULL ,
CHANGE COLUMN `preparation_duration_seconds` `preparation_duration_seconds` INT(11) NULL ,
CHANGE COLUMN `budget` `budget` INT(11) NULL ,
CHANGE COLUMN `slug` `slug` VARCHAR(200) NULL ,
CHANGE COLUMN `published` `published` TINYINT(1) NULL DEFAULT '0' ;

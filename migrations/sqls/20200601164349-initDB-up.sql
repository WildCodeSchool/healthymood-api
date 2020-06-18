SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(150) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `diets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dish_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `meal_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recipe_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `article_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `blocked` tinyint(1) NOT NULL DEFAULT '0',
  `fb_uid` varchar(100) DEFAULT NULL,
  `address_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `password_UNIQUE` (`password`),
  UNIQUE KEY `fb_uid_UNIQUE` (`fb_uid`),
  KEY `fk_users_1_idx` (`address_id`),
  CONSTRAINT `fk_users_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `generic_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `content` longtext NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`),
  KEY `fk_generic_pages_1_idx` (`user_id`),
  CONSTRAINT `fk_generic_pages_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `image` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `article_category_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_UNIQUE` (`slug`),
  KEY `fk_articles_1_idx` (`article_category_id`),
  KEY `fk_articles_2_idx` (`user_id`),
  CONSTRAINT `fk_articles_1` FOREIGN KEY (`article_category_id`) REFERENCES `article_categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_users_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `article_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `content` mediumtext NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `article_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_article_comments_1_idx` (`user_id`),
  KEY `fk_article_comments_2_idx` (`article_id`),
  CONSTRAINT `fk_article_comments_2` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
  CONSTRAINT `fk_users_comments_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `measure_unit` varchar(45) NOT NULL,
  `is_allergen` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_ingredients_1_idx` (`user_id`),
  CONSTRAINT `fk_ingredients_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `image` varchar(200) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `preparation_duration_seconds` int NOT NULL,
  `budget` int NOT NULL,
  `slug` varchar(200) NOT NULL,
  `calories` int NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `recipe_category_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recipes_1_idx` (`recipe_category_id`),
  KEY `fk_recipes_2_idx` (`user_id`),
  CONSTRAINT `fk_recipes_1` FOREIGN KEY (`recipe_category_id`) REFERENCES `recipe_categories` (`id`),
  CONSTRAINT `fk_recipes_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recipe_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `content` mediumtext NOT NULL,
  `approuved` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recipe_comments_1_idx` (`user_id`),
  KEY `fk_recipe_comments_2_idx` (`recipe_id`),
  CONSTRAINT `fk_recipe_comments_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_recipe_comments_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `diet_recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `diet_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_diet_recipes_1_idx` (`diet_id`),
  KEY `fk_diet_recipes_2_idx` (`recipe_id`),
  CONSTRAINT `fk_diet_recipes_1` FOREIGN KEY (`diet_id`) REFERENCES `diets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_diet_recipes_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dish_type_recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dish_type_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dish_type_recipes_1_idx` (`dish_type_id`),
  KEY `fk_dish_type_recipes_2_idx` (`recipe_id`),
  CONSTRAINT `fk_dish_type_recipes_1` FOREIGN KEY (`dish_type_id`) REFERENCES `dish_types` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_dish_type_recipes_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `meal_type_recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `meal_type_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_meal_type_recipes_1_idx` (`meal_type_id`),
  KEY `fk_meal_type_recipes_2_idx` (`recipe_id`),
  CONSTRAINT `fk_meal_type_recipes_1` FOREIGN KEY (`meal_type_id`) REFERENCES `meal_types` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_meal_type_recipes_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `recipe_ingredient_quantities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `recipe_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recipe_ingredient_quantities_1_idx` (`recipe_id`),
  KEY `fk_recipe_ingredient_quantities_2_idx` (`ingredient_id`),
  CONSTRAINT `fk_recipe_ingredient_quantities_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_recipe_ingredient_quantities_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `scores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `score` int NOT NULL,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_scores_1_idx` (`user_id`),
  KEY `fk_scores_2_idx` (`recipe_id`),
  CONSTRAINT `fk_scores_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_scores_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user_favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_add_favories_1_idx` (`user_id`),
  KEY `fk_add_favories_2_idx` (`recipe_id`),
  CONSTRAINT `fk_add_favories_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_add_favories_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `content` varchar(140) NOT NULL,
  `link` varchar(200) DEFAULT NULL,
  `dispatch_planning` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
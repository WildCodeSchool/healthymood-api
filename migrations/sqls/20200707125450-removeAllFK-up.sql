ALTER TABLE `article_comments` 
DROP FOREIGN KEY `fk_users_comments_1`,
DROP FOREIGN KEY `fk_article_comments_2`;
ALTER TABLE `article_comments` 
DROP INDEX `fk_article_comments_2_idx` ,
DROP INDEX `fk_article_comments_1_idx` ;

ALTER TABLE `diet_recipes` 
DROP FOREIGN KEY `fk_diet_recipes_2`,
DROP FOREIGN KEY `fk_diet_recipes_1`;
ALTER TABLE `diet_recipes` 
DROP INDEX `fk_diet_recipes_2_idx` ,
DROP INDEX `fk_diet_recipes_1_idx` ;

ALTER TABLE `dish_type_recipes` 
DROP FOREIGN KEY `fk_dish_type_recipes_2`,
DROP FOREIGN KEY `fk_dish_type_recipes_1`;
ALTER TABLE `dish_type_recipes` 
DROP INDEX `fk_dish_type_recipes_2_idx` ,
DROP INDEX `fk_dish_type_recipes_1_idx` ;

ALTER TABLE `ingredients` 
DROP FOREIGN KEY `fk_ingredients_1`;
ALTER TABLE `ingredients` 
DROP INDEX `fk_ingredients_1_idx` ;

ALTER TABLE `meal_type_recipes` 
DROP FOREIGN KEY `fk_meal_type_recipes_2`,
DROP FOREIGN KEY `fk_meal_type_recipes_1`;
ALTER TABLE `meal_type_recipes` 
DROP INDEX `fk_meal_type_recipes_2_idx` ,
DROP INDEX `fk_meal_type_recipes_1_idx` ;

ALTER TABLE `ratings` 
DROP FOREIGN KEY `fk_scores_2`,
DROP FOREIGN KEY `fk_scores_1`;
ALTER TABLE `ratings` 
DROP INDEX `fk_scores_2_idx` ,
DROP INDEX `fk_scores_1_idx` ;

ALTER TABLE `recipe_comments` 
DROP FOREIGN KEY `fk_recipe_comments_2`,
DROP FOREIGN KEY `fk_recipe_comments_1`;
ALTER TABLE `recipe_comments` 
DROP INDEX `fk_recipe_comments_2_idx` ,
DROP INDEX `fk_recipe_comments_1_idx` ;

ALTER TABLE `recipe_ingredient_quantities` 
DROP FOREIGN KEY `fk_recipe_ingredient_quantities_2`,
DROP FOREIGN KEY `fk_recipe_ingredient_quantities_1`;
ALTER TABLE `recipe_ingredient_quantities` 
DROP INDEX `fk_recipe_ingredient_quantities_2_idx` ,
DROP INDEX `fk_recipe_ingredient_quantities_1_idx` ;

ALTER TABLE `recipes` 
DROP FOREIGN KEY `fk_recipes_1`;
ALTER TABLE `recipes` 
DROP INDEX `fk_recipes_1_idx` ;

ALTER TABLE `user_favorites` 
DROP FOREIGN KEY `fk_add_favories_2`,
DROP FOREIGN KEY `fk_add_favories_1`;
ALTER TABLE `user_favorites` 
DROP INDEX `fk_add_favories_2_idx` ,
DROP INDEX `fk_add_favories_1_idx` ;

ALTER TABLE `users` 
DROP FOREIGN KEY `fk_users_1`;
ALTER TABLE `users` 
DROP INDEX `fk_users_1_idx` ;

require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const extractToken = require('./middlewares/extractToken');
const requireAuth = require('./middlewares/requireAuth');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./docs/swagger.yaml');
const app = express();
const PORT =
  process.env.PORT || (process.env.NODE_ENV === 'test' ? 4001 : 4000);

process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('beforeExit', () => {
  app.close((err) => {
    if (err) console.error(JSON.stringify(err), err.stack);
  });
});

// middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
app.use(extractToken);

// routes
app.use('/ingredients', require('./routes/ingredient.routes.js'));
app.use('/meal_types', require('./routes/meal_types.routes.js'));
app.use('/meal_type_recipes', require('./routes/meal_type_recipes.routes.js'));
app.use('/diet', require('./routes/diet.routes.js'));
app.use('/dish_types', require('./routes/dish_types.routes.js'));
app.use('/notifications', require('./routes/notification.routes.js'));
app.use('/addresses', require('./routes/addresse.routes.js'));
app.use('/generic_pages', require('./routes/generic_pages.routes'));
app.use('/recipes', require('./routes/recipe.routes.js'));
app.use('/recipe_categories', require('./routes/recipe-categories.routes.js'));
app.use('/users', require('./routes/user.routes.js'));
app.use('/auth', require('./routes/auth.routes.js'));
app.use('/articles', require('./routes/article.routes.js'));
app.use('/article_categories', require('./routes/article-categories.routes.js'));
app.use('/ratings', require('./routes/rating.routes.js'));
app.use('/post_recipe', require('./routes/sendMyRecipe.routes.js'));
app.use('/favorites', require('./routes/favorite.routes.js'));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    app.use('/favorites', requireAuth, require('./routes/favorite.routes.js'));
    res.status(401).send('invalid token...');
  }
});
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
});
app.set('x-powered-by', false);

// set port, listen for requests
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Server is running on port ' + PORT);
  }
});
module.exports = server;

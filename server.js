const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();
const PORT =
  process.env.PORT || (process.env.NODE_ENV === 'test' ? 3001 : 5000);

// middlewares
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use('/ingredients', require('./routes/ingredient.routes.js'));
app.use('/notifications', require('./routes/notification.routes.js'));
app.use('/recipes', require('./routes/recipe.routes.js'));
app.use('/generic_pages', require('./routes/generic_pages.routes.js'));
app.use('/addresses', require('./routes/addresse.routes.js'));

// set port, listen for requests
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Server is running on port ' + PORT);
  }
});
module.exports = server;

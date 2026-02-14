const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const port = 3000;
const apiVersion = '1';
const ticketRoutes = require('./routes/ticket.routes');
const assetRoutes = require('./routes/asset.routes');
const sequelize = require('./database/db');

// Test database connection
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.use(cors());
app.use(express.json());
app.use(`/api/v${apiVersion}/tickets`, ticketRoutes);
app.use(`/api/v${apiVersion}/assets`, assetRoutes);

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Recolour API',
            version: apiVersion,
            description: 'API documentation for Recolour backend'
        },
        servers: [
            { url: `http://localhost:${port}/api/v${apiVersion}` }
        ]
    },
    apis: [path.join(__dirname, 'routes/*.js')]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => console.log('Error syncing database: ' + err));
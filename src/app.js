const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./models');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health / root route
app.get('/', (req, res) => {
	res.json({ status: 'ok', message: 'Task Management API', docs: '/api-docs' });
});

app.use(errorHandler);

app.on('ready', () => {});

module.exports = { app, db };

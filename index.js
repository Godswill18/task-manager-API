const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const {testDbCon} = require('./DB/dbConn.js'); // Sequelize connection
const { logger } = require('./middleware/logEvents.js');
const errorHandler = require('./middleware/errorHandler.js');
const authRoute = require('./route/authRoute.js');
const taskRoute = require('./route/taskRoute.js'); // Assuming you have a taskRoute.js file for tasks

dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoute);
app.use('/api/', taskRoute); // Assuming you have a taskRoute.js file for tasks

const PORT = process.env.PORT || 8000;

// Initialize database & start server
(async () => {
  try {
    const dbCon = await testDbCon();

    // Optional: test connection with raw SQL
    const [results] = await dbCon.query('SELECT NOW()');
    console.log("Current Time:", results);

    // Optional: sync all models
    // await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();

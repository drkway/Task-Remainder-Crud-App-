const { app, db } = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const start = async () => {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`Server running on ${port}`));
  } catch (err) { console.error('Startup error', err); process.exit(1); }
};

start();

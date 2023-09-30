import console from "console";
import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import { fileURLToPath } from "url";
import databaseConfig from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const db = {};
const DataTypes = Sequelize.DataTypes;

const sequelize = new Sequelize(
  databaseConfig.development.database,
  databaseConfig.development.username,
  databaseConfig.development.password,
  {
    host: databaseConfig.development.host,
    dialect: databaseConfig.development.dialect,
    port: databaseConfig.development.port,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
});
for await (const file of files) {
  const module = await import(`./${file}`);
  const model = module.default(sequelize, DataTypes);
  db[model.name] = model;
}
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;

import { env } from "./src/config/env.js";

export default {
  db: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,
  },
  migrationsDir: "migrations",
};

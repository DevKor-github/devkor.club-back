import { Migrator } from "@mikro-orm/migrations";
import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import * as dotenv from "dotenv";

dotenv.config();

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
  },
  debug: true,
  extensions: [Migrator],
  schemaGenerator: {
    createForeignKeyConstraints: false,
    managementDbName: "mikro_orm_migrations_management",
  },
};

export default config;

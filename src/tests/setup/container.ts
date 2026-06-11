import { SQL } from "bun";
import {
  GenericContainer,
  Wait,
  type StartedTestContainer,
} from "testcontainers";
import { join } from "path";

/*

Här är en funktion som vi kan återanvända i våra olika repository-tester. Den här funktionen
ger oss en ny färsk postgres databas som vi kan testa på.

*/

// Läser in vår schema.sql fil som innehåller SQL-kod för att skapa vår databasstruktur.
const SCHEMA_PATH = join(import.meta.dirname, "../../db/schema.sql");

export const createTestDatabase = async () => {
  const POSTGRES_USER = "postgres";
  const POSTGRES_PASSWORD = "postgres";

  // GenericContainer är en klass som låter oss skapa en Docker-container med valfri image.
  const container = await new GenericContainer("postgres:17")
    .withEnvironment({
      POSTGRES_DB: "socialapp_test",
      POSTGRES_USER: POSTGRES_USER,
      POSTGRES_PASSWORD: POSTGRES_PASSWORD,
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage(/database system is ready to accept connections/, 2),
    )
    .start();

  const databaseUrl = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${container.getHost()}:${container.getMappedPort(5432)}/socialapp_test`;

  const db = new SQL(databaseUrl);

  // Skapar tabeller och databasstrukturen.
  await db.file(SCHEMA_PATH);

  return {
    container,
    db,
  };
};

export const teardownTestDatabase = async (container: StartedTestContainer) => {
  await container.stop();
};

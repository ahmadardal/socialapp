import { describe, mock, it, expect, afterAll, beforeEach } from "bun:test";
import {
  clearTestDatabase,
  createTestDatabase,
  teardownTestDatabase,
} from "../tests/setup/container";
import type { RegisterRequest } from "../types/http";

// Vi skapar en färsk testdatabas.
const testDb = await createTestDatabase();

// Om någon vill importera "db" från "../db/client" så kommer de att få vår testdatabas istället för den riktiga databasen. Vi tar över importen med andra ord.

mock.module("../db/client", () => {
  return {
    db: testDb.db,
  };
});

const { insertOne } = await import("../repository/userRepository");

const baseUser: RegisterRequest = {
  username: "testuser",
  visibility: "public",
  profile_image: "https://example.com/profile.jpg",
  bio: "This is a test user.",
  display_name: "Test User",
  email: "testuser@example.com",
  phone: "1234567890",
  birthdate: "1990-01-01",
  password: "securepassword",
};

beforeEach(async () => {
  await clearTestDatabase(testDb.db);
});

afterAll(async () => {
  // Detta körs efter alla tester har genomförts.

  await testDb.db.close();
  await teardownTestDatabase(testDb.container);
});

// Describe är en funktion som används för att gruppera relaterade tester tillsammans.
// Det hjälper till att organisera testerna och göra det tydligare vad som testas.
describe("userRepository", () => {
  it("should insert and return the created user row with an auto-generated id", async () => {
    const created = await insertOne(baseUser);

    expect(created.username).toBe(baseUser.username);
    expect(created.visibility).toBe(baseUser.visibility!);
    expect(created.profile_image).toBe(baseUser.profile_image!);
    expect(created.bio).toBe(baseUser.bio!);
    expect(created.display_name).toBe(baseUser.display_name);
    expect(created.email).toBe(baseUser.email);
    expect(created.phone).toBe(baseUser.phone);
    expect(created.birthdate.toISOString()).toBe(
      new Date(baseUser.birthdate).toISOString(),
    );

    expect(created.password).toBe(baseUser.password);
    expect(created.id).toBeDefined();
  });
});

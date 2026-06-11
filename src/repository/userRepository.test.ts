import { describe, mock } from "bun:test";
import { createTestDatabase } from "../tests/setup/container";
import * as userRepository from "./userRepository";
import type { RegisterRequest } from "../types/http";

const testDb = await createTestDatabase();

mock.module("../db/client", () => {
  return {
    db: testDb.db,
  };
});

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

// Describe är en funktion som används för att gruppera relaterade tester tillsammans.
// Det hjälper till att organisera testerna och göra det tydligare vad som testas.
describe("userRepository", () => {
  it("should insert and return the created user row with an auto-generated id", async () => {
    const created = await userRepository.insertOne(baseUser);
  });
});

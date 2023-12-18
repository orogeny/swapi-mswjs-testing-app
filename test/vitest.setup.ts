import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { server } from "../src/mock_api/node";

beforeAll(() => server.listen());

// runs a cleanup after each test case (eg clearing jsdom)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

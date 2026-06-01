import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetEmployeeHandlers } from "./handlers";
import { server } from "./server";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetEmployeeHandlers();
});
afterAll(() => server.close());

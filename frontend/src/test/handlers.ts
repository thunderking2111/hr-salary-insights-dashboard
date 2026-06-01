import { http, HttpResponse } from "msw";
import { paginatedEmployees } from "./fixtures";

export const handlers = [
  http.get("/api/employees/", () => HttpResponse.json(paginatedEmployees)),
];

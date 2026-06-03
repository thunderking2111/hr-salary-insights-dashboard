import { http, HttpResponse } from "msw";
import { server } from "./server";

export function stubCreateEmployeeValidationError(): void {
  server.use(
    http.post("/api/employees/", () =>
      HttpResponse.json(
        {
          last_name: ["This field may not be blank."],
          department: ["This field may not be blank."],
          salary: ["This field may not be blank."],
          date_of_joining: ["This field may not be blank."],
        },
        { status: 400 },
      ),
    ),
  );
}

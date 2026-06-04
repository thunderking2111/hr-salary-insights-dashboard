import { http, HttpResponse } from "msw";
import { country02JobTitleInsights } from "./chartCountryJobTitles";
import { elevenJobTitlesForCountry01 } from "./elevenJobTitlesForCountry01";
import { server } from "./server";

let releaseStaleCountry01Response: (() => void) | null = null;

/** Country01 blocks until released; other countries respond immediately. */
export function stubOutOfOrderJobTitleFetches(): void {
  const gate = new Promise<void>((resolve) => {
    releaseStaleCountry01Response = resolve;
  });

  server.use(
    http.get("/api/insights/salary-by-job-title/", async ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        await gate;
        return HttpResponse.json(elevenJobTitlesForCountry01);
      }
      if (country === "Country02") {
        return HttpResponse.json(country02JobTitleInsights);
      }
      return HttpResponse.json([]);
    }),
  );
}

export function releaseStaleCountry01JobTitles(): void {
  releaseStaleCountry01Response?.();
}

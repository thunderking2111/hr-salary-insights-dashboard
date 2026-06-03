import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetEmployeeHandlers } from "./handlers";
import { server } from "./server";

class ResizeObserverMock implements ResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    const width = 800;
    const height = 400;
    this.callback(
      [
        {
          target,
          contentRect: {
            width,
            height,
            top: 0,
            left: 0,
            bottom: height,
            right: width,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ],
      this,
    );
  }

  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  resetEmployeeHandlers();
});
afterAll(() => server.close());

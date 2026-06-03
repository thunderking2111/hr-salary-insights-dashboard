import { describe, expect, it } from "vitest";
import { createDialogMutationTracker } from "./dialogMutationTracker";

describe("createDialogMutationTracker", () => {
  it("reports closed early when the dialog closes before finish", () => {
    const tracker = createDialogMutationTracker();
    tracker.start();
    tracker.notifyDialogClosed();

    expect(tracker.wasClosedBeforeResult()).toBe(true);
    tracker.finish();
  });

  it("does not report closed early when finish happens without closing", () => {
    const tracker = createDialogMutationTracker();
    tracker.start();
    tracker.finish();

    expect(tracker.wasClosedBeforeResult()).toBe(false);
  });
});

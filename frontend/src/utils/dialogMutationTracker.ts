export interface DialogMutationTracker {
  start: () => void;
  notifyDialogClosed: () => void;
  finish: () => void;
  wasClosedBeforeResult: () => boolean;
}

export function createDialogMutationTracker(): DialogMutationTracker {
  let inFlight = false;
  let closedEarly = false;

  return {
    start() {
      inFlight = true;
      closedEarly = false;
    },
    notifyDialogClosed() {
      if (inFlight) {
        closedEarly = true;
      }
    },
    finish() {
      inFlight = false;
      closedEarly = false;
    },
    wasClosedBeforeResult() {
      return closedEarly;
    },
  };
}

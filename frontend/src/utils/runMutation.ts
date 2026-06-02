export function runMutation(
  mutation: Promise<unknown>,
  onSuccess: () => void,
  setError: (message: string) => void,
  errorMessage: string,
): void {
  void mutation
    .then(onSuccess)
    .catch((err: unknown) => {
      setError(err instanceof Error ? err.message : errorMessage);
    });
}

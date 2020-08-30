export class AlreadyDeletedError extends Error {
  constructor(message: string) {
    super(message);
  }
}
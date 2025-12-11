export type Session = {
  [key: string | symbol]: any;
};
const store = new Map<string|symbol,Session>();
import { CLIENT_ID_KEY, PROVIDER_STORE_KEY } from "../Context";

export type ClintInstance = {
  [CLIENT_ID_KEY]: symbol;
  [PROVIDER_STORE_KEY]: Map<string|symbol,any>
  [key: string]: any;

};
export const createClientInstance = (clientId: symbol) => {
  const instance: ClintInstance = {
    [CLIENT_ID_KEY]: clientId,
    [PROVIDER_STORE_KEY]: new Map(),
  };
  return instance;
}
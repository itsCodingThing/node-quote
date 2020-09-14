export interface QuoteObj {
  id?: string;
  title: string;
  content: string;
}

export interface ServerResponse {
  ok: boolean;
  response?: QuoteObj;
  error?: string | Record<string, unknown>;
}

export interface SureThingPromiseRes<T> {
  ok: boolean;
  response?: T;
  error?: T;
}

export interface SavedQuoteObj {
  exists: boolean;
  data?: QuoteObj;
  msg?: string;
}

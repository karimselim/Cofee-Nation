import { APIRequestContext } from "@playwright/test";

export type ApiResult<T> = { status: number; body: T };

/** Small wrapper over Playwright's APIRequestContext: one place for the base URL and JSON handling. */
export class ApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseUrl = process.env.API_URL || "http://localhost:3200/api"
  ) {}

  async get<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<ApiResult<T>> {
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    });
    const response = await this.request.get(url.toString());
    return { status: response.status(), body: (await response.json()) as T };
  }

  async post<T>(path: string, data: unknown): Promise<ApiResult<T>> {
    const response = await this.request.post(`${this.baseUrl}${path}`, { data });
    return { status: response.status(), body: (await response.json()) as T };
  }
}

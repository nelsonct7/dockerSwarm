import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const createApiClient = (
  baseURL: string,
  serviceName: string,
  config: Partial<ApiClientConfig> = {}
): AxiosInstance => {
  const defaultConfig: ApiClientConfig = {
    baseURL,
    timeout: 5000, // 5 seconds is more reasonable
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  };

  const client: AxiosInstance = axios.create(defaultConfig);

  // Add retry logic with proper typing
  const retryConfig: IAxiosRetryConfig = {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error: AxiosError): boolean => {
      const shouldRetry = axiosRetry.isNetworkOrIdempotentRequestError(error);
      const isConnectionTimeout = error.code === "ECONNABORTED";
      return shouldRetry || isConnectionTimeout;
    },
    // Optional: Implement onRetry callback for logging
    onRetry: (
      retryCount: number,
      error: AxiosError,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestConfig: any
    ): void => {
      console.warn(
        `${serviceName} API Retry attempt ${retryCount}:`,
        error.message,
        `(${requestConfig.url})`
      );
    },
  };

  axiosRetry(client, retryConfig);

  // Add response interceptor with proper typing
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (axios.isAxiosError(error)) {
        console.error(`${serviceName} API Error:`, {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          url: error.config?.url,
        });
        if (error.response?.status === 401) {
          localStorage.removeItem("swarm-user-token");
        }
      } else {
        console.error(`${serviceName} Unexpected Error:`, error);
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authServiceClient: AxiosInstance = createApiClient(
  "http://localhost:3001",
  "Auth"
);

export const postServiceClient: AxiosInstance = createApiClient(
  "http://localhost:3002/api",
  "Post"
);

// Add request interceptor to dynamically set the Authorization header
postServiceClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("swarm-user-token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Optional: Add custom error handling types
export type ApiErrorResponse = {
  status: number;
  message: string;
  details?: unknown;
};

// Optional: Add custom response type
export type ApiSuccessResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

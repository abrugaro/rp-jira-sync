export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  logs: string;
}

export interface ExecutionResponseData {
  mainTaskKey: string;
  mainTaskLink: string
}

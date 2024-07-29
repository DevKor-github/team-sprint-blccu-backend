export interface ExceptionData {
  statusCode: number;
  errorCode: number;
  message: string;
  name: string;
  className?: string;
  methodName?: string;
}

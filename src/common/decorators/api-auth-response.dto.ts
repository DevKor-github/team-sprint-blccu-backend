import { applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';

export function ApiAuthResponse() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    applyDecorators(ApiCookieAuth())(target, propertyKey, descriptor);
  };
}

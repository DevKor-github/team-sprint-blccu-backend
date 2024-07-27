import { Reflector } from '@nestjs/core';
import { ExceptionData } from '../interfaces/exception-data.interface';
import { EXCEPTION_METADATA_KEY } from './exception-metadata.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function ApiResponseFromMetadata(
  methods: { service: any; methodName: string }[],
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const reflector = new Reflector();
    let allExceptionMetadata: ExceptionData[] = [];

    methods.forEach(({ service, methodName }) => {
      const method = service.prototype[methodName];
      const exceptionMetadata = reflector.get(EXCEPTION_METADATA_KEY, method);

      if (exceptionMetadata) {
        if (Array.isArray(exceptionMetadata)) {
          allExceptionMetadata = [
            ...allExceptionMetadata,
            ...exceptionMetadata,
          ];
        } else {
          allExceptionMetadata.push(exceptionMetadata);
        }
      }
    });

    if (allExceptionMetadata.length) {
      const mergedByStatus = mergeExceptionDataByStatus(allExceptionMetadata);
      const apiResponses = mergedByStatus.map((metadata: ExceptionData) =>
        ApiResponse({
          status: metadata.statusCode,
          description: metadata.message,
        }),
      );

      applyDecorators(...apiResponses)(target, propertyKey, descriptor);
    }
  };
}

function mergeExceptionDataByStatus(
  exceptionDataArray: ExceptionData[],
): ExceptionData[] {
  const mergedData: { [status: number]: ExceptionData } = {};

  exceptionDataArray.forEach((data) => {
    if (!mergedData[data.statusCode]) {
      mergedData[data.statusCode] = {
        statusCode: data.statusCode,
        message: `${data.name}(${data.errorCode}): ${data.message}`,
        name: data.name,
        errorCode: data.errorCode,
      };
    } else {
      mergedData[data.statusCode].message +=
        `<br>${data.name}(${data.errorCode}): ${data.message}`;
    }
  });

  return Object.values(mergedData);
}

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
function formatStack(stack, level = 0) {
  return stack
    .map((call, index) => {
      level += 1;
      const indent = '&nbsp;'.repeat(level);
      const prefix = index === 0 ? ' ' : '- Calls:';
      return `${indent}${prefix} ${call}`;
    })
    .join('<br>');
}

function mergeExceptionDataByStatus(
  exceptionDataArray: ExceptionData[],
): ExceptionData[] {
  const mergedData: { [status: number]: ExceptionData } = {};

  exceptionDataArray.forEach((data) => {
    const formattedStack = formatStack(data.stack);

    const messageTemplate = `**${data.name}(${data.errorCode})**: ${data.message}<br><small>${formattedStack}</small>`;
    if (!mergedData[data.statusCode]) {
      mergedData[data.statusCode] = {
        statusCode: data.statusCode,
        message: messageTemplate,
        name: data.name,
        errorCode: data.errorCode,
      };
    } else {
      mergedData[data.statusCode].message += `<br>${messageTemplate}`;
    }
  });

  return Object.values(mergedData);
}

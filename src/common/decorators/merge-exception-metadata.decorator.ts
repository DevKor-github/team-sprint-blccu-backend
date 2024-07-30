import { Reflector } from '@nestjs/core';
import { ExceptionData } from '../interfaces/exception-data.interface';
import { EXCEPTION_METADATA_KEY } from './exception-metadata.decorator';
import { SetMetadata } from '@nestjs/common';

export function MergeExceptionMetadata(
  methods: { service: any; methodName: string }[],
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const reflector = new Reflector();
    let mergedMetadata: ExceptionData[] = [];

    methods.forEach(({ service, methodName }) => {
      const method = service.prototype[methodName];
      const existingExceptionMetadata = reflector.get(
        EXCEPTION_METADATA_KEY,
        method,
      );
      const stack = `${target.constructor.name}.${propertyKey}`;
      if (Array.isArray(existingExceptionMetadata)) {
        mergedMetadata = [
          ...mergedMetadata,
          ...existingExceptionMetadata.map((metadata) => ({
            ...metadata,
            stack: [stack, ...(metadata.stack || [])],
          })),
        ];
      } else if (existingExceptionMetadata) {
        mergedMetadata.push({
          ...existingExceptionMetadata,
          stack: [stack, ...(existingExceptionMetadata.stack || [])],
        });
      }
    });

    const targetExceptionMetadata = reflector.get(
      EXCEPTION_METADATA_KEY,
      target[propertyKey],
    );

    if (Array.isArray(targetExceptionMetadata)) {
      mergedMetadata = [...mergedMetadata, ...targetExceptionMetadata];
    } else if (targetExceptionMetadata) {
      mergedMetadata.push(targetExceptionMetadata);
    }

    if (mergedMetadata.length) {
      SetMetadata(EXCEPTION_METADATA_KEY, mergedMetadata)(
        target,
        propertyKey,
        descriptor,
      );
    }
  };
}

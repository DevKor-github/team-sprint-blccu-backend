import { SetMetadata } from '@nestjs/common';
import { ExceptionData } from '../interfaces/exception-data.interface';
import { Reflector } from '@nestjs/core';

export const EXCEPTION_METADATA_KEY = 'exceptionMetadata';

export function ExceptionMetadata(exceptionInfoArray: ExceptionData[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const reflector = new Reflector();
    const existingMetadata =
      reflector.get(EXCEPTION_METADATA_KEY, target[propertyKey]) || [];

    const newMetadata = Array.isArray(existingMetadata)
      ? [...existingMetadata, ...exceptionInfoArray]
      : [existingMetadata, ...exceptionInfoArray];

    SetMetadata(EXCEPTION_METADATA_KEY, newMetadata)(
      target,
      propertyKey,
      descriptor,
    );
  };
}

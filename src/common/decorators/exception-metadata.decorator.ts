import { SetMetadata } from '@nestjs/common';
import { ExceptionData } from '../interfaces/exception-data.interface';
import { Reflector } from '@nestjs/core';

export const EXCEPTION_METADATA_KEY = 'exceptionMetadata';

export function ExceptionMetadata(exceptionInfoArray: ExceptionData[]) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const reflector = new Reflector();
    const existingMetadata =
      reflector.get(EXCEPTION_METADATA_KEY, target[propertyKey]) || [];

    // 메서드 이름과 클래스 이름을 예외 데이터에 추가
    const methodName = propertyKey;
    const className = target.constructor.name;
    const newExceptionInfoArray = exceptionInfoArray.map((exceptionInfo) => ({
      ...exceptionInfo,
      methodName,
      className,
    }));

    const newMetadata = Array.isArray(existingMetadata)
      ? [...existingMetadata, ...newExceptionInfoArray]
      : [existingMetadata, ...newExceptionInfoArray];

    SetMetadata(EXCEPTION_METADATA_KEY, newMetadata)(
      target,
      propertyKey,
      descriptor,
    );
  };
}

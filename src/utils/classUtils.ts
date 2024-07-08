import 'reflect-metadata';
import { User } from 'src/APIs/users/entities/user.entity';
import { getMetadataArgsStorage } from 'typeorm';

export function getUserFields(): string[] {
  const metadata = getMetadataArgsStorage();

  // 클래스의 모든 멤버 변수를 담을 배열
  const members: string[] = [];

  const entityMetadata = metadata.filterColumns(User);
  entityMetadata.forEach((meta) => {
    members.push(meta.propertyName);
  });

  return members;
}

export function toCamelCase(snakeCase: string): string {
  return snakeCase.replace(/_([a-z])/g, (group) => group[1].toUpperCase());
}

export function convertToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = convertToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

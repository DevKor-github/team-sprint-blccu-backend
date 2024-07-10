import 'reflect-metadata';
import { User } from 'src/APIs/users/entities/user.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { getMetadataArgsStorage } from 'typeorm';

export function getUserFields(): string[] {
  const metadata = getMetadataArgsStorage();
  // Get columns from the User entity
  const userColumns = metadata.filterColumns(User);
  // Get columns from the CommonEntity (superclass)
  const commonEntityColumns = metadata.filterColumns(CommonEntity);
  // Combine both sets of columns
  const allColumns = [...userColumns, ...commonEntityColumns];
  // Extract property names
  const members: string[] = allColumns.map((col) => col.propertyName);

  return members;
}

export function toCamelCase(snakeCase: string): string {
  return snakeCase.replace(/_([a-z])/g, (group) => group[1].toUpperCase());
}

interface ITransformKeysToArgsFormat {
  keys: string[];
  args: string;
}
export function transformKeysToArgsFormat({
  keys,
  args,
}: ITransformKeysToArgsFormat): string[] {
  return keys.map((key) => `${args}.${key}`);
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

import { getMetadataArgsStorage } from 'typeorm';

export function getClassFields(dto: any): string[] {
  const fields = getMetadataArgsStorage()
    .filterColumns(dto)
    .map((column) => column.propertyName);
  return fields;
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

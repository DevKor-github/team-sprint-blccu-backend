import { getMetadataArgsStorage } from 'typeorm';

export function getClassFields(dto: any): string[] {
  const fields = getMetadataArgsStorage()
    .filterColumns(dto)
    .map((column) => column.propertyName);
  return fields;
}

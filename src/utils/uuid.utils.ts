import { v4 } from 'uuid';

export function getUUID(): string {
  return v4();
}

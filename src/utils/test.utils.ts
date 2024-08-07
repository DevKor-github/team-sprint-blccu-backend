import { Repository } from 'typeorm';

export type MockRepository<T = any> =
  | Partial<Record<keyof T, jest.Mock>>
  | Partial<T>;

export class MockRepositoryFactory {
  static getMockRepository<T>(
    type: new (...args: any[]) => T,
  ): MockRepository<T> {
    const mockRepository: MockRepository<T> = {};

    Object.getOwnPropertyNames(Repository.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockRepository[key] = jest.fn();
      });

    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockRepository[key] = type.prototype[key];
      });

    return mockRepository;
  }
}

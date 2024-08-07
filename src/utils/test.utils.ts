import { Repository } from 'typeorm';
import { jest } from '@jest/globals';

export type MockRepository<T = any> = {
  [P in keyof T]?: jest.Mock<any>;
};

export class MockRepositoryFactory {
  static getMockRepository<T>(
    type: new (...args: any[]) => T,
  ): MockRepository<T> {
    const mockRepository: MockRepository<T> = {};

    // Repository prototype의 메서드를 jest.fn()으로 대체
    Object.getOwnPropertyNames(Repository.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockRepository[key] = jest.fn<any>();
      });

    // 사용자 정의 클래스의 메서드를 jest.fn()으로 대체
    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockRepository[key] = jest.fn<any>();
      });

    return mockRepository;
  }
}

export const TEST_DATE_FIELDS = {
  dateCreated: expect.any(Date),
  dateUpdated: expect.any(Date),
  dateDeleted: expect.any(Date),
};

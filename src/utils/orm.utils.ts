import {
  QueryFailedError,
  EntityNotFoundError,
  CannotCreateEntityIdMapError,
  OptimisticLockCanNotBeUsedError,
  PessimisticLockTransactionRequiredError,
  TransactionAlreadyStartedError,
  TransactionNotStartedError,
  NoNeedToReleaseEntityManagerError,
} from 'typeorm';
import { EXCEPTIONS } from '../common/blccu-exception';

export function getTypeOrmError(exception: any) {
  if (exception instanceof QueryFailedError) {
    return EXCEPTIONS.QUERY_FAILED_ERROR;
  }
  if (exception instanceof EntityNotFoundError) {
    return EXCEPTIONS.ENTITY_NOT_FOUND_ERROR;
  }
  if (exception instanceof CannotCreateEntityIdMapError) {
    return EXCEPTIONS.CANNOT_CREATE_ENTITY_ID_MAP_ERROR;
  }
  if (exception instanceof OptimisticLockCanNotBeUsedError) {
    return EXCEPTIONS.OPTIMISTIC_LOCK_CAN_NOT_BE_USED_ERROR;
  }
  if (exception instanceof PessimisticLockTransactionRequiredError) {
    return EXCEPTIONS.PESSIMISTIC_LOCK_TRANSACTION_REQUIRED_ERROR;
  }
  if (exception instanceof TransactionAlreadyStartedError) {
    return EXCEPTIONS.TRANSACTION_ALREADY_STARTED_ERROR;
  }
  if (exception instanceof TransactionNotStartedError) {
    return EXCEPTIONS.TRANSACTION_NOT_STARTED_ERROR;
  }
  if (exception instanceof NoNeedToReleaseEntityManagerError) {
    return EXCEPTIONS.NO_NEED_TO_RELEASE_ENTITY_MANAGER_ERROR;
  }
  return null;
}

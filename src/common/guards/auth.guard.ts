import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BlccuException } from '../blccu-exception';

@Injectable()
export class AuthGuardV2 implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!req.user.userId) throw new BlccuException('NOT_LOGGED_IN');
    return true;
  }
}

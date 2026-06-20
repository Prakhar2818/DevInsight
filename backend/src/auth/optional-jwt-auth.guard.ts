import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // If there is no user, return a dummy object instead of a falsy value.
    // Returning a falsy value (like null or false) causes NestJS to throw a 401 Unauthorized exception!
    return user || { isGuest: true };
  }
}

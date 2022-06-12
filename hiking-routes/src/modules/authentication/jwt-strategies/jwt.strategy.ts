import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Secret } from 'src/secrets.env';
import { UsersService } from 'src/modules/users/users.service';
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Secret.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: any) {
    return { ...payload.user };
  }
}
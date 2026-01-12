import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }
  async validate(payload: any) {
    if (payload.role) {
      return { userId: payload.sub, email: payload.email, role: payload.role };
    }

    const user = await this.usersService.findById(payload.sub);
    return { userId: payload.sub, email: payload.email, role: user?.role };
  }
}

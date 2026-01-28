import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user) {
      return null;
    }

    // Si un champ spécifique est demandé
    return data ? user[data] : user;
  },
);

import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdService {
  validateObjectId(id: string, fieldName = 'ID') {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${fieldName}: ${id}`);
    }
  }
}

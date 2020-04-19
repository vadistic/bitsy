import { ApiProperty } from '@nestjs/swagger';
import { ObjectID } from 'mongodb';

export class NamespaceDto {
  @ApiProperty({
    description: 'namespace to use',
    minLength: 3,
    maxLength: 24,
    example: 'my-namespace123',
  })
  namespace: string;
}

export class UniqueDto {
  @ApiProperty({
    description: 'objectId',
  })
  id: ObjectID;
}

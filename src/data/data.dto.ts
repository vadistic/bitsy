import { ApiProperty } from '@nestjs/swagger';

export class NamespaceDto {
  @ApiProperty({
    description: 'unique namespace (dynamically created)',
    minLength: 3,
    maxLength: 24,
    example: 'example-namespace',
  })
  namespace: string;
}

export class UniqueDto {
  @ApiProperty({
    description: 'objectId from mongo',
  })
  id: string;
}

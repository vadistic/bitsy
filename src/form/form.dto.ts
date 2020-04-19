import { ApiProperty } from '@nestjs/swagger';

export class NamespaceDto {
  @ApiProperty({
    description: 'namespace name value',
    minLength: 3,
    maxLength: 24,
    example: 'super-cool-namespace',
  })
  namespace: string;
}

export class UniqueDto {
  @ApiProperty({
    description: 'objectId',
  })
  id: string;
}

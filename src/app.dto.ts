import { ApiProperty } from '@nestjs/swagger';
import { serialise } from './utils';
import { IsString, IsOptional } from 'class-validator';

export class HelloDTO {
  @ApiProperty({
    description: `your name`,
    example: `Jakub`,
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  static create({ name }: HelloDTO = {}) {
    return serialise(HelloDTO, { name });
  }
}

export class MessageDTO {
  @ApiProperty({
    description: `server message`,
  })
  @IsString()
  message!: string;

  static create({ message }: MessageDTO) {
    return serialise(MessageDTO, { message });
  }
}

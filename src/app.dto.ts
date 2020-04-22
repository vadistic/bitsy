import { serialise } from './utils';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsAlpha,
} from 'class-validator';

export class HelloDTO {
  @IsOptional()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(24)
  name?: string;

  static create({ name }: HelloDTO = {}) {
    return serialise(HelloDTO)({ name });
  }
}

export class MessageDTO {
  @IsString()
  @IsNotEmpty()
  @IsString()
  message!: string;

  static create({ message }: MessageDTO) {
    return serialise(MessageDTO)({ message });
  }
}

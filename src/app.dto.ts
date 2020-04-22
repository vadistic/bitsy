import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsAlpha,
} from 'class-validator';
import { toClass } from './dto/transform';
import { Expose } from 'class-transformer';

export class HelloDTO {
  @IsOptional()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(24)
  @Expose()
  name?: string;

  static create({ name }: HelloDTO = {}) {
    return toClass(HelloDTO, { name });
  }
}

export class MessageDTO {
  @IsString()
  @IsNotEmpty()
  @IsString()
  @Expose()
  message!: string;

  static create({ message }: MessageDTO) {
    return toClass(MessageDTO, { message });
  }
}

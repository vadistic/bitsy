import { plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export interface FormModelInput {
  namespace: string;
  form: any;
}

export class Form {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  namespace: string;

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  form: any;

  static create(input: FormModelInput) {
    return plainToClass(Form, input);
  }
}

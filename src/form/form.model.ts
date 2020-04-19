import { plainToClass } from 'class-transformer';
import { ObjectID } from 'mongodb';

export interface FormModelInput {
  namespace: string;
  form: any;
}

export class FormModel {
  _id: ObjectID;

  namespace: string;

  createdAt: Date = new Date();

  form: any;

  static create(input: FormModelInput) {
    return plainToClass(FormModel, input);
  }
}

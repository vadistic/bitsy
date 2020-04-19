import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Form } from './form.model';
import { NamespaceDto, UniqueDto } from './form.dto';

@Injectable()
export class FormService {
  constructor(private readonly dbService: DatabaseService) {}

  collections = {
    form: this.dbService.db.collection<Form>('Form'),
  };

  async getAll(): Promise<Form[]> {
    const cursor = this.collections.form.find();
    const all = await cursor.toArray();

    return all;
  }

  async getLast(): Promise<Form | null> {
    const res = await this.collections.form.findOne(
      {},
      { sort: { _id: -1 }, limit: 1 },
    );

    return res;
  }

  async getbyId({ id }: UniqueDto): Promise<Form | null> {
    const res = await this.collections.form.findOne(
      { _id: { $eq: id } },
      { limit: 1 },
    );

    return res;
  }

  async getNamespacedAll({ namespace }: NamespaceDto): Promise<Form[]> {
    const cursor = this.collections.form.find({
      namespace: { $eq: namespace },
    });

    return cursor.toArray();
  }

  async getNamespacedLast({ namespace }: NamespaceDto): Promise<Form | null> {
    const res = await this.collections.form.findOne(
      {
        namespace: { $eq: namespace },
      },
      { sort: { _id: -1 }, limit: 1 },
    );

    return res;
  }

  async createNamespaced(
    { namespace }: NamespaceDto,
    data: any,
  ): Promise<string> {
    const doc = Form.create({ form: data, namespace });

    const res = await this.collections.form.insertOne(doc);

    return res.insertedId;
  }
}

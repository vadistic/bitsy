import { ObjectId } from 'mongodb';
import { Groups, ExposeDefault } from './common.dto';
import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const baseExample: BaseModel = {
  _id: new ObjectId().toHexString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
// ────────────────────────────────────────────────────────────────────────────────

@Exclude()
export class BaseModel {
  @ApiProperty({
    description: `internal mongodb id`,
    type: String,
    example: baseExample._id,
  })
  @IsMongoId()
  @ExposeDefault({ groups: [Groups.MONGO] })
  _id!: string;

  // ────────────────────────────────────────────────────────────────────────────────

  @ApiProperty({
    description: `created at date`,
    type: String,
    format: 'datetime',
    example: baseExample.createdAt,
  })
  @IsDateString()
  @ExposeDefault({ groups: [Groups.MONGO] })
  createdAt!: string;

  // ────────────────────────────────────────────────────────────────────────────────

  @ApiProperty({
    description: `updated at date`,
    type: String,
    format: 'datetime',
    example: baseExample.updatedAt,
  })
  @IsOptional()
  @IsDateString()
  @ExposeDefault({ groups: [Groups.MONGO] })
  updatedAt!: string | null;
}

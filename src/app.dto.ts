import { ApiProperty } from '@nestjs/swagger';

export class HelloDTO {
  @ApiProperty({
    description: `your name`,
    example: `Jakub`,
    required: false,
  })
  name?: string;
}

export class MessageDTO {
  @ApiProperty({
    description: `server message`,
  })
  message!: string;
}

export class Message {
  @ApiProperty({
    description: `server message`,
  })
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  static create(input: MessageDTO) {
    return new Message(input.message);
  }
}

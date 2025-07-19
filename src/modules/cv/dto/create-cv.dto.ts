import { ApiProperty } from "@nestjs/swagger";

export class CreateCvDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;

    @ApiProperty()
    userId: string;
}

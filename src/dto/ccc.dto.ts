import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CccDto {
  @ApiProperty({ name: "aaa", enum: ["a1", "a2", "a3"] })
  aaa: string;

  @ApiPropertyOptional({ name: "bbb" })
  bbb: number;

  @ApiProperty({ name: "ccc" })
  ccc: Array<string>;
}

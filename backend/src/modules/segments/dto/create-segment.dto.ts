import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsIn, IsOptional } from 'class-validator';
import { SegmentRule } from '../entities/segment.entity';

export class CreateSegmentDto {
  @ApiProperty({ example: 'Lapsed Whales ($100+)', description: 'Human-readable cohort name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'High value players inactive for 7 or more days', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'AND', enum: ['AND', 'OR'], default: 'AND' })
  @IsIn(['AND', 'OR'])
  @IsOptional()
  combinator?: 'AND' | 'OR';

  @ApiProperty({
    example: [
      { field: 'attributes.lifetimeSpend', operator: '>=', value: 100 },
      { field: 'attributes.level', operator: '>=', value: 20 },
    ],
    description: 'Array of rule filter conditions',
  })
  @IsArray()
  rules: SegmentRule[];
}

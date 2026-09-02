import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({ example: 'req_84920482', description: 'Unique transaction request identifier' })
  requestId: string;

  @ApiProperty({ example: '2026-09-02T12:00:00.000Z', description: 'ISO 8601 UTC timestamp' })
  timestamp: string;

  @ApiProperty({ description: 'Payload data for successful requests', required: false })
  data?: T;

  @ApiProperty({ example: 'Operation completed successfully', required: false })
  message?: string;
}

export class ApiErrorDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'req_84920482' })
  requestId: string;

  @ApiProperty({ example: '2026-09-02T12:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'BAD_REQUEST' })
  errorCode: string;

  @ApiProperty({ example: 'Validation failed on input parameters' })
  message: string;

  @ApiProperty({ required: false })
  details?: any;
}

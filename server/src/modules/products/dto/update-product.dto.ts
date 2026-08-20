import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // All fields from CreateProductDto are optional in Update
  // Client cannot modify: id, createdAt, updatedAt, deletedAt
  // These are handled server-side only
}

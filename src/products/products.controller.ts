import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiParam({
    name: 'page',
    description: 'Page number',
    allowEmptyValue: true,
    type: Number,
  })
  async getAllProducts(@Query() query) {
    return this.productsService.getAllProducts(query.page);
  }

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    if (isNaN(id)) {
      return {
        error: 'Invalid id',
      };
    }
    return this.productsService.getProduct(id);
  }
}
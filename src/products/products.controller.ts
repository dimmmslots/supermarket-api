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
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    allowEmptyValue: true,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    allowEmptyValue: true,
    description: 'Search by name',
    type: String,
  })
  @ApiQuery({
    name: 'priceRange',
    allowEmptyValue: true,
    description: 'Search by price range',
    type: String,
  })
  @ApiQuery({
    name: 'available',
    allowEmptyValue: true,
    description: 'Search by availability',
    type: String,
  })
  async getAllProducts(
    @Query('page') page: number,
    @Query('search') search: string,
    @Query('priceRange') priceRange: string,
    @Query('available') available: string,
  ) {
    return this.productsService.getAllProducts(
      page,
      search,
      priceRange,
      available,
    );
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

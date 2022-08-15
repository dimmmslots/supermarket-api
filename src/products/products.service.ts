import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  getAllProducts(page: number) {
    if (isNaN(page) || !page) {
      return this.prisma.product.findMany({ take: 20 });
    }

    return this.prisma.product.findMany({
      skip: --page * 20,
      take: 20,
    });
  }

  async getProduct(id: number) {
    const parsedId = parseInt(id.toString(), 10);
    const data = await this.prisma.product.findUnique({
      where: { id: parsedId },
    });
    // check if data is valid
    if (!data) {
      return {
        error: 'Product not found',
      };
    }
    return data;
  }
}

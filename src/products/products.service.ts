import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(page: number, search: string) {
    function paginate(data: any[], page: number) {
      // check if page is undefined
      if (page === undefined) {
        return data.slice(0, 20);
      }
      const start = (page - 1) * 20;
      const end = page * 20;
      return data.slice(start, end);
    }

    function searchByName(data: any[], search: string) {
      return data.filter((item) => {
        return item.name.toLowerCase().includes(search.toLowerCase());
      });
    }

    const data = await this.prisma.product.findMany();
    if (search) {
      const result = searchByName(data, search);
      return paginate(result, page);
    }

    // paginate data
    return paginate(data, page);
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

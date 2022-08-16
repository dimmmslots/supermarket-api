import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(
    page: number,
    search: string,
    priceRange: string,
    available: string,
  ) {
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

    function searchByPriceRange(data: any[], range: string) {
      // switch case for price range with 3 conditions (chp, nrm, xps)
      switch (range) {
        case 'chp':
          return data.filter((item) => {
            return item.price <= 25;
          });
        case 'nrm':
          return data.filter((item) => {
            return item.price > 25 && item.price <= 50;
          });
        case 'xps':
          return data.filter((item) => {
            return item.price > 50;
          });
      }
    }

    function searchByAvailable(data: any[], available: string) {
      // parse string to boolean
      const availableBool = available === 'true' ? true : false;
      if (availableBool) {
        return data.filter((item) => {
          return item.stock > 0;
        });
      }

      return data.filter((item) => {
        return item.stock === 0;
      });
    }

    let data = await this.prisma.product.findMany();
    if (search) {
      data = searchByName(data, search);
    }

    if (priceRange) {
      data = searchByPriceRange(data, priceRange);
    }

    if (available) {
      data = searchByAvailable(data, available);
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

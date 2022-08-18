import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uniformResponseDto } from './dto/uniform-response.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts(
    page: number,
    search: string,
    priceRange: string,
    available: string,
  ): Promise<uniformResponseDto> {
    function parseResponseData(data: any) {
      if (!data) {
        return false;
      }
      const parsedData = data.map((product: any) => {
        return {
          name: product.name,
          price: product.price,
          available: product.stock ? true : false,
          url: `http://localhost:3000/products/${product.id}`,
        };
      });
      return parsedData;
    }
    function paginate(data: any[], page: number) {
      // check if page is undefined
      if (page === undefined) {
        // return data.slice(0, 20);
        return parseResponseData(data.slice(0, 20));
      }
      const start = (page - 1) * 20;
      const end = page * 20;
      return parseResponseData(data.slice(start, end));
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
    // return paginate(data, page);
    return {
      message: 'Success',
      statusCode: 200,
      data: paginate(data, page),
    };
  }

  async getProduct(id: number): Promise<uniformResponseDto> {
    const parsedId = parseInt(id.toString(), 10);
    const data = await this.prisma.product.findUnique({
      where: { id: parsedId },
    });
    // check if data is valid
    if (!data) {
      return {
        message: 'Product not found',
        statusCode: 404,
        data: null,
      };
    }
    return {
      message: 'Success',
      statusCode: 200,
      data: data,
    };
  }
}

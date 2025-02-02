import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImages } from './entities/product-images.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [TypeOrmModule.forFeature([Product, ProductImages]), AuthModule],
  exports: [ProductsService, TypeOrmModule],
  // exports: [TypeOrmModule], // Exporta TypeOrmModule para que otros módulos puedan importarlo y utilizarlo
})
export class ProductsModule {}

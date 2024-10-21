import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImages } from './product-images.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;
  @Column('int', {
    default: 0,
  })
  stock: number;
  @Column('text', {
    array: true,
  })
  sizes: string[];
  @Column('text')
  gender: string;

  //tags
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];
  //images
  @OneToMany(() => ProductImages, (images) => images.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImages[];

  @BeforeInsert()
  checkSlogInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlogUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}

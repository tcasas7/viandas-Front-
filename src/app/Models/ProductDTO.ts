

export class ProductDTO {
    id!: number;
    day!: number;
    name!: string;
    price!: number;
    imageName!: string;
    imagePath!: string;
    imageFile?: File;

    constructor(init?: Partial<ProductDTO>) {
        Object.assign(this, init);
    }
  }
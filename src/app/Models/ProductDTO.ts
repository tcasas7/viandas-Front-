

export class ProductDTO {
    id!: number;
    day!: number;
    name!: string;
    price!: number;
    imageName!: string;
    imagePath!: string;
    imageFile?: File;
    menuId!: number;

    constructor(init?: Partial<ProductDTO>) {
        Object.assign(this, init);
    }
  }
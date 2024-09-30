import { DayOfWeek } from './Enums/DayOfWeekEnums';

export class ProductDTO {
    id!: number
    day!: DayOfWeek;
    name!: string
    imageName!: string;
    imagePath!: string;

    sanitizedImagePath?: string;

    constructor(init?: Partial<ProductDTO>) {
        Object.assign(this, init);
    }
}

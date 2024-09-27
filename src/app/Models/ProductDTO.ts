import { DayOfWeek } from './Enums/DayOfWeekEnums';

export class ProductDTO {
    id!: number
    day!: DayOfWeek;
    name!: string
    imageName!: string;
}
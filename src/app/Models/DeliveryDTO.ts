import { DayOfWeek } from './Enums/DayOfWeekEnums';

export class DeliveryDTO {
    Id!: number;
    productId!: number;
    delivered!: boolean;
    deliveryDate!: DayOfWeek;
    quantity!: number;
    productName!: string;
    menuId!: number;
}

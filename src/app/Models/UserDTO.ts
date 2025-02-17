import { LocationDTO } from "./LocationDTO"

export class UserDTO {
    Id!: number
    role!: number
    email!: string
    phone!: string
    firstName!: string
    lastName!: string
    locations: Array<LocationDTO> = new Array<LocationDTO>();
    isVerified!: boolean;
}
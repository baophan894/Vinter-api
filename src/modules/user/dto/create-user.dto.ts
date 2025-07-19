import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    googleId: string;

    @IsNotEmpty()
    @IsString()
    photo: string;

    @IsIn(['User', 'Admin', 'HR'])
    role: string;
}

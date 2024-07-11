import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class updateUserDto{
    @IsString()
    @IsNotEmpty()
    username?: string;
  
    @IsString()
    @IsNotEmpty()
    password?: string;
}
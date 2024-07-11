import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class createUserDto{
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
}
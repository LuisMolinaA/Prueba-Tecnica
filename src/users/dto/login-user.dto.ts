import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class loginUserDto{
    @IsString()
    @IsNotEmpty()
    username: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
}
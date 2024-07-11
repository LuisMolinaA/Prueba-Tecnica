import { Body, Controller, Get, Post, Param, Delete, ParseIntPipe, UsePipes, ValidationPipe, Put, Patch, HttpException, Query, UseGuards } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { updateUserDto } from './dto/update-user.dto';
import { loginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('/createUser')
    @UsePipes(new ValidationPipe({ transform: true }))
    createUser(@Body() newUser: createUserDto): Promise<User | HttpException> {
        return this.userService.createUser(newUser);
    }

    @Post("/login")
    loginUser(@Body() userLogin: loginUserDto){
        return this.userService.loginUser(userLogin)
    }

    @Get('/getUsers')
    getUsers(): Promise<User[]| HttpException> {
        return this.userService.getUsers();
    }

    @Get('/getUser/:id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUser(id);
    }

    @Delete('deleteUser/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.deleteUser(id);
    }

    @Put('/updateUser/:id')
    updateUser(@Param('id', ParseIntPipe) id: number,@Body() user: updateUserDto,){
        const updateUser = this.userService.updateUser(id, user);
    }

}

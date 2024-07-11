import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { HttpException } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRespository: Repository<User>,
    private jwtAuthService:JwtService
) { }

    async createUser(user: createUserDto) {
        const userFound = await this.userRespository.findOne({
            where: {
                username: user.username
            }
        })

        if (userFound) {
            return new HttpException("usuario ya creado", HttpStatus.CONFLICT)
        }

        const { password } = user;
        const plainToHash = await hash(password, 10)

        user = { ...user, password: plainToHash }
        return this.userRespository.save(user)
    }

    async getUsers() {
        const users = await this.userRespository.find();
        if (!users) {
            return new HttpException("usuarios no encontrados", HttpStatus.NOT_FOUND)
        }
        return users;
    }


    async getUser(id: number) {
        const user = await this.userRespository.findOne({ where: { id } });
        if (!user) {
            return new HttpException("usuario no encontrado", HttpStatus.NOT_FOUND)
        }
        return user;
    }

    async deleteUser(id: number) {
        const delUser = await this.userRespository.delete({ id });
        if (delUser.affected === 0) {
            return new HttpException("usuario no encontrado", HttpStatus.NOT_FOUND)
        }
        return delUser
    }

    async updateUser(id: number, user: updateUserDto) {
        const users = await this.userRespository.findOne({ where: { id } });
        if (!users) {
            return new HttpException("usuarios no encontrados", HttpStatus.NOT_FOUND)
        }
        if (user.password){
            const { password } = user;
            const plainToHash = await hash(password, 10)
    
            user = { ...user, password: plainToHash }
        }
        
        return this.userRespository.update({ id }, user)
    }

    async loginUser(user: loginUserDto) {
        const { username, password } = user;
        const findUser = await this.userRespository.findOne({ where: { username: username } })
        if (!findUser) {
            return new HttpException("usuario no encontrado", HttpStatus.NOT_FOUND)
        }
        const checkPassword = await compare(password, findUser.password)
        
        if (checkPassword == false) {
            return new HttpException("Password incorrecto", HttpStatus.FORBIDDEN)
        }

        const payload = {id: findUser.id, name: findUser.username}
        const token = await this.jwtAuthService.sign(payload)
        const data = { findUser, token}
        return data
    }
}

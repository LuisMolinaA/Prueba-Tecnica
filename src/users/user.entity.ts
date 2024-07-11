import { Task } from 'src/tasks/entity/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    authStrategy: String;

    @OneToMany(() => Task, task => task.createdBy)
    tasks: Task[];
}
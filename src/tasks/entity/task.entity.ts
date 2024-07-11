import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from "../../users/user.entity";
import { IsDateString } from 'class-validator';

export enum TaskCompletionStatus {
    PENDIENTE = 'pendiente',
    COMPLETADA = 'completada',
    CANCELADA = 'cancelada'
}

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: TaskCompletionStatus.PENDIENTE })
    completionStatus: TaskCompletionStatus;

    @IsDateString()
    @Column({ type: 'date' })
    dueDate: Date;

    @ManyToOne(() => User, user => user.tasks)
    @JoinColumn({ name: 'userId' })
    createdBy: User;
}

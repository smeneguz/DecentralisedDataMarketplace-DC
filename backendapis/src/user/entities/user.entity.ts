import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//we need add some controls on inputs

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar'})
    username: string;
    @Column({ type: 'varchar' })
    password: string;
    @Column({ type: 'varchar'})
    address: string;
    @Column({ type: 'varchar'})
    privateKey: string;
}

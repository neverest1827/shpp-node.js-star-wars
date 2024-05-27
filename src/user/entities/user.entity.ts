import {
  Column,
  Entity,
  JoinColumn, JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from "typeorm";

import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_role' })
  role: Role[];
}

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../user/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  value: string;

  @ManyToMany(() => User, (user) => user.role)
  users: User[];
}
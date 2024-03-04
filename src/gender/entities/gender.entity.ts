import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { People } from '../../people/entities/people.entity';

@Entity()
export class Gender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @OneToMany(() => People, (people) => people.gender)
  people_gender: People[];
}

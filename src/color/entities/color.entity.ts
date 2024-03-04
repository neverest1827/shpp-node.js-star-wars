import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { People } from '../../people/entities/people.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @OneToMany(() => People, (people) => people.hair_color)
  people_hair_color: People[];

  @OneToMany(() => People, (people) => people.skin_color)
  people_skin_color: People[];

  @OneToMany(() => People, (people) => people.eye_color)
  people_eye_color: People[];
}

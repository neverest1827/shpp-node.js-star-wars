import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { People } from '../../people/entities/people.entity';
import { Film } from '../../film/entities/film.entity';
import { Image } from '../../image/entities/image.entity';

@Entity()
export class Specie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  classification: string;

  @Column()
  designation: string;

  @Column()
  average_height: string;

  @Column()
  skin_colors: string;

  @Column()
  hair_colors: string;

  @Column()
  eye_colors: string;

  @Column()
  average_lifespan: string;

  @Column({ nullable: true })
  homeworld: string | null;

  @Column()
  language: string;

  @ManyToMany(() => People, (people) => people.species)
  people: People[];

  @ManyToMany(() => Film, (film) => film.species)
  @JoinTable({ name: 'specie_film' })
  films: Film[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  @Column()
  url: string;

  @OneToMany(() => Image, (image) => image.specie)
  images: Image[];
}

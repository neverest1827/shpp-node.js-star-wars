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
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rotation_period: string;

  @Column()
  orbital_period: string;

  @Column()
  diameter: string;

  @Column()
  climate: string;

  @Column()
  gravity: string;

  @Column()
  terrain: string;

  @Column()
  surface_water: string;

  @Column()
  population: string;

  @OneToMany(() => People, (people) => people.homeworld)
  residents: People[];

  @ManyToMany(() => Film, (film) => film.planets)
  @JoinTable({ name: 'planet_film' })
  films: Film[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  @Column()
  url: string;

  @OneToMany(() => Image, (image) => image.planet)
  images: Image[];
}

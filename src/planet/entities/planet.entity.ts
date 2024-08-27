import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../person/entities/person.entity';
import { Film } from '../../film/entities/film.entity';
import { Image } from '../../image/entities/image.entity';
import { Specie } from '../../specie/entities/specie.entity';

@Entity('planets')
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  rotation_period: number;

  @Column({ nullable: true })
  orbital_period: number;

  @Column({ nullable: true })
  diameter: number;

  @Column()
  climate: string;

  @Column()
  gravity: string;

  @Column()
  terrain: string;

  @Column({ nullable: true })
  surface_water: number;

  @Column({ type: 'bigint', nullable: true })
  population: number;

  @ManyToMany(() => Person, (person) => person.homeworld)
  residents: Person[];

  @ManyToMany(() => Specie, (specie) => specie.homeworld)
  species: Specie[];

  @ManyToMany(() => Film, (film) => film.planets)
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

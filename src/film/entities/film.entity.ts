import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { People } from '../../people/entities/people.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Starship } from '../../starship/entities/starship.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Image } from '../../image/entities/image.entity';

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  episode_id: number;

  @Column({ type: 'text' })
  opening_crawl: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column()
  release_date: string;

  @ManyToMany(() => People, (people) => people.films)
  characters: People[];

  @ManyToMany(() => Planet, (planet) => planet.films)
  planets: Planet[];

  @ManyToMany(() => Starship, (starship) => starship.films)
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.films)
  vehicles: Vehicle[];

  @ManyToMany(() => Specie, (specie) => specie.films)
  species: Specie[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  @Column()
  url: string;

  @OneToMany(() => Image, (image) => image.film)
  images: Image[];
}

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../person/entities/person.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Starship } from '../../starship/entities/starship.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Image } from '../../image/entities/image.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  episode_id: number;

  @Column({ type: 'text' })
  opening_crawl: string;

  @Column()
  director: string;

  @Column()
  producer: string;

  @Column()
  release_date: string;

  @ManyToMany(() => Person, (person) => person.films, { cascade: true })
  @JoinTable({
    name: 'films_people',
    joinColumn: { name: 'film_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'people_id', referencedColumnName: 'id' },
  })
  characters: Person[];

  @ManyToMany(() => Planet, (planet) => planet.films, { cascade: true })
  @JoinTable({
    name: 'films_planets',
    joinColumn: { name: 'film_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'planet_id', referencedColumnName: 'id' },
  })
  planets: Planet[];

  @ManyToMany(() => Starship, (starship) => starship.films, { cascade: true })
  @JoinTable({
    name: 'films_starships',
    joinColumn: { name: 'film_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'starship_id', referencedColumnName: 'id' },
  })
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.films, { cascade: true })
  @JoinTable({
    name: 'films_vehicles',
    joinColumn: { name: 'film_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vehicle_id', referencedColumnName: 'id' },
  })
  vehicles: Vehicle[];

  @ManyToMany(() => Specie, (specie) => specie.films, { cascade: true })
  @JoinTable({
    name: 'films_species',
    joinColumn: { name: 'film_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specie_id', referencedColumnName: 'id' },
  })
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

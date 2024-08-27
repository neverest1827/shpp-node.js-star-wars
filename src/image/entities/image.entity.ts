import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../people/entities/person.entity';
import { Film } from '../../film/entities/film.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Starship } from '../../starship/entities/starship.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  filename: string;

  @Column()
  url: string;

  @ManyToOne(() => Person, (people) => people.images)
  @JoinColumn({ name: 'person_id' })
  people: Person;

  @ManyToOne(() => Film, (film) => film.images)
  @JoinColumn({ name: 'film_id' })
  film: Film;

  @ManyToOne(() => Planet, (planet) => planet.images)
  @JoinColumn({ name: 'planet_id' })
  planet: Planet;

  @ManyToOne(() => Specie, (specie) => specie.images)
  @JoinColumn({ name: 'specie_id' })
  specie: Specie;

  @ManyToOne(() => Starship, (starship) => starship.images)
  @JoinColumn({ name: 'starship_id' })
  starship: Starship;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.images)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;
}

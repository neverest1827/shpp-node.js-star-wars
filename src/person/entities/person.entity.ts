import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Film } from '../../film/entities/film.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Starship } from '../../starship/entities/starship.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  mass: number;

  @Column()
  hair_color: string;

  @Column()
  skin_color: string;

  @Column()
  eye_color: string;

  @Column()
  birth_year: string;

  @Column()
  gender: string;

  @ManyToMany(() => Planet, (planet: Planet) => planet.residents, {
    cascade: true,
  })
  @JoinTable({
    name: 'people_planets',
    joinColumn: { name: 'person_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'planet_id', referencedColumnName: 'id' },
  })
  homeworld: Planet[];

  @ManyToMany(() => Film, (film: Film) => film.characters)
  films: Film[];

  @ManyToMany(() => Specie, (specie: Specie) => specie.people, {
    cascade: true,
  })
  @JoinTable({
    name: 'people_species',
    joinColumn: { name: 'person_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specie_id', referencedColumnName: 'id' },
  })
  species: Specie[];

  @ManyToMany(() => Starship, (starship: Starship) => starship.pilots, {
    cascade: true,
  })
  @JoinTable({
    name: 'people_starships',
    joinColumn: { name: 'person_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'starship_id', referencedColumnName: 'id' },
  })
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicle: Vehicle) => vehicle.pilots, {
    cascade: true,
  })
  @JoinTable({
    name: 'people_vehicles',
    joinColumn: { name: 'person_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vehicle_id', referencedColumnName: 'id' },
  })
  vehicles: Vehicle[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  @Column()
  url: string;

  @OneToMany(() => Image, (image: Image) => image.people)
  images: Image[];
}

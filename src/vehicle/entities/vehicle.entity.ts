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

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column({ type: 'bigint', nullable: true })
  cost_in_credits: number;

  @Column({ nullable: true })
  length: number;

  @Column({ nullable: true })
  max_atmosphering_speed: number;

  @Column({ nullable: true })
  crew: number;

  @Column({ nullable: true })
  passengers: number;

  @Column({ type: 'bigint', nullable: true })
  cargo_capacity: number;

  @Column()
  consumables: string;

  @Column()
  vehicle_class: string;

  @ManyToMany(() => Person, (person) => person.vehicles)
  pilots: Person[];

  @ManyToMany(() => Film, (film) => film.vehicles)
  films: Film[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date;

  @Column()
  url: string;

  @OneToMany(() => Image, (image) => image.vehicle)
  images: Image[];
}

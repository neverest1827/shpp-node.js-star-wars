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
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  model: string;

  @Column()
  manufacturer: string;

  @Column()
  cost_in_credits: string;

  @Column()
  length: string;

  @Column()
  max_atmosphering_speed: string;

  @Column()
  crew: string;

  @Column()
  passengers: string;

  @Column()
  cargo_capacity: string;

  @Column()
  consumables: string;

  @Column()
  vehicle_class: string;

  @ManyToMany(() => People, (people) => people.vehicles)
  pilots: People[];

  @ManyToMany(() => Film, (film) => film.vehicles)
  @JoinTable({ name: 'vehicle_film' })
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

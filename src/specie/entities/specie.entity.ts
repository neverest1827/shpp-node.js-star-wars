import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from '../../people/entities/person.entity';
import { Film } from '../../film/entities/film.entity';
import { Image } from '../../image/entities/image.entity';
import { Planet } from '../../planet/entities/planet.entity';

@Entity('species')
export class Specie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  classification: string;

  @Column()
  designation: string;

  @Column({ nullable: true })
  average_height: number;

  @Column()
  skin_colors: string;

  @Column()
  hair_colors: string;

  @Column()
  eye_colors: string;

  @Column({ nullable: true })
  average_lifespan: number;

  @ManyToMany(() => Planet, (planet) => planet.species)
  @JoinTable({
    name: 'species_planets',
    joinColumn: { name: 'specie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'planet_id', referencedColumnName: 'id' },
  })
  homeworld: Planet[];

  @Column()
  language: string;

  @ManyToMany(() => Person, (person) => person.species)
  people: Person[];

  @ManyToMany(() => Film, (film) => film.species)
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

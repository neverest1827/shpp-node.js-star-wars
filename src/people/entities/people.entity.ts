import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';
import { Color } from '../../color/entities/color.entity';
import { Gender } from '../../gender/entities/gender.entity';
import { Planet } from '../../planet/entities/planet.entity';
import { Film } from '../../film/entities/film.entity';
import { Specie } from '../../specie/entities/specie.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Starship } from '../../starship/entities/starship.entity';

@Entity()
export class People {
  @PrimaryGeneratedColumn()
  id: number; //+

  @Column()
  name: string; //+

  @Column()
  height: string; //+

  @Column()
  mass: string; //+

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'hair_color_id' })
  hair_color: Color; //+

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'skin_color_id' })
  skin_color: Color; //+

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'eye_color_id' })
  eye_color: Color; //+

  @Column()
  birth_year: string; //+

  @ManyToOne(() => Gender)
  @JoinColumn({ name: 'gender_id' })
  gender: Gender; //+

  @ManyToOne(() => Planet, (planet) => planet.residents)
  @JoinColumn({ name: 'homeworld_id' })
  homeworld: Planet;

  @ManyToMany(() => Film, (film) => film.characters)
  @JoinTable({ name: 'people_film' })
  films: Film[];

  @ManyToMany(() => Specie, (specie) => specie.people)
  @JoinTable({ name: 'people_specie' })
  species: Specie[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.pilots)
  @JoinTable({ name: 'people_vehicle' })
  vehicles: Vehicle[];

  @ManyToMany(() => Starship, (starship) => starship.pilots)
  @JoinTable({ name: 'people_starship' })
  starships: Starship[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date; //+

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  edited: Date; //+

  @Column()
  url: string; //+

  @OneToMany(() => Image, (image) => image.people)
  images: Image[];

  getImages(): Image[] {
    return this.images;
  }
}

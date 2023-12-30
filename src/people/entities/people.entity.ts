import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PeopleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  height: string;

  @Column()
  mass: string;

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

  @Column()
  homeworld: string;

  // @ManyToMany(() => Film)
  // @JoinTable()
  // films: Film[];
  @Column()
  films: string;

  // @ManyToMany(() => Species)
  // @JoinTable()
  // species: Species[];
  @Column()
  species: string;

  // @ManyToMany(() => Vehicle)
  // @JoinTable()
  // vehicles: Vehicle[];
  @Column()
  vehicles: string;

  // @ManyToMany(() => Starship)
  // @JoinTable()
  // starships: Starship[];
  @Column()
  starships: string;

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;
}

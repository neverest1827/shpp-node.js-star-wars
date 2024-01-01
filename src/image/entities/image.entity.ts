import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PeopleEntity } from '../../people/entities/people.entity';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_path: string;

  @ManyToOne(() => PeopleEntity, (people) => people.images)
  people: PeopleEntity;
}

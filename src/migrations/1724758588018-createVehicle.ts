import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVehicle1724758588018 implements MigrationInterface {
  name = 'CreateVehicle1724758588018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`vehicles\` (
    \`id\` int NOT NULL AUTO_INCREMENT, 
    \`name\` varchar(255) NOT NULL, 
    \`model\` varchar(255) NOT NULL, 
    \`manufacturer\` varchar(255) NOT NULL, 
    \`cost_in_credits\` bigint NULL, 
    \`length\` int NULL, 
    \`max_atmosphering_speed\` int NULL, 
    \`crew\` int NULL, 
    \`passengers\` int NULL, 
    \`cargo_capacity\` bigint NULL, 
    \`consumables\` varchar(255) NOT NULL, 
    \`vehicle_class\` varchar(255) NOT NULL, 
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_aa397b791341ed3615397050d4\` (\`name\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_aa397b791341ed3615397050d4\` ON \`vehicles\``,
    );
    await queryRunner.query(`DROP TABLE \`vehicles\``);
  }
}

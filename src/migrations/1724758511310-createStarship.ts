import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStarship1724758511310 implements MigrationInterface {
  name = 'CreateStarship1724758511310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`starships\` (
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
    \`hyperdrive_rating\` int NULL, 
    \`MGLT\` int NULL, 
    \`starship_class\` varchar(255) NOT NULL, 
    \`created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`edited\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    \`url\` varchar(255) NOT NULL, 
    UNIQUE INDEX \`IDX_41580e76da7903fb3827a3510e\` (\`name\`), 
    PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_41580e76da7903fb3827a3510e\` ON \`starships\``,
    );
    await queryRunner.query(`DROP TABLE \`starships\``);
  }
}

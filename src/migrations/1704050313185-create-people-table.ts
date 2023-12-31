import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePeopleTable1704050313185 implements MigrationInterface {
  name = 'CreatePeopleTable1704050313185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`people_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`newName\` varchar(255) NOT NULL, \`height\` varchar(255) NOT NULL, \`mass\` varchar(255) NOT NULL, \`hair_color\` varchar(255) NOT NULL, \`skin_color\` varchar(255) NOT NULL, \`eye_color\` varchar(255) NOT NULL, \`birth_year\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`homeworld\` varchar(255) NOT NULL, \`films\` varchar(255) NOT NULL, \`species\` varchar(255) NOT NULL, \`vehicles\` varchar(255) NOT NULL, \`starships\` varchar(255) NOT NULL, \`created\` varchar(255) NOT NULL, \`edited\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`people_entity\``);
  }
}

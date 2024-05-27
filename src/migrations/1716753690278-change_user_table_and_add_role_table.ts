import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserTableAndAddRoleTable1716753690278 implements MigrationInterface {
    name = 'ChangeUserTableAndAddRoleTable1716753690278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`userId\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_98082dbb08817c9801e32dd015\` (\`value\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role\` (\`userUserId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_da96c443031d8a3f812ce81d4f\` (\`userUserId\`), INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`), PRIMARY KEY (\`userUserId\`, \`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_da96c443031d8a3f812ce81d4fa\` FOREIGN KEY (\`userUserId\`) REFERENCES \`user\`(\`userId\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_da96c443031d8a3f812ce81d4fa\``);
        await queryRunner.query(`DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_da96c443031d8a3f812ce81d4f\` ON \`user_role\``);
        await queryRunner.query(`DROP TABLE \`user_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_98082dbb08817c9801e32dd015\` ON \`role\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}

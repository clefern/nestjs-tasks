import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../migrations.utils';

export class CrateUserTable1661223748691 implements MigrationInterface {
  private static readonly table = new Table({
    name: 'UserTest',
    columns: [
      ...MigrationUtil.getIDColumn(),
      MigrationUtil.getVarCharColumn({ name: 'name' }),
      MigrationUtil.getVarCharColumn({ name: 'email' }),
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(CrateUserTable1661223748691.table);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(CrateUserTable1661223748691.table);
  }
}

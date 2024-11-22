import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingProperty1732279961954 implements MigrationInterface {
  name = "UpdatingProperty1732279961954";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remover a coluna companyId da tabela property
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "companyId"`);

    // 2. Criar a join table para a relação ManyToMany
    await queryRunner.query(`
            CREATE TABLE "property_companies_company" (
                "propertyId" int NOT NULL,
                "companyId" int NOT NULL,
                CONSTRAINT "PK_property_companies_company" PRIMARY KEY ("propertyId", "companyId")
            );
        `);

    // 3. Adicionar as constraints de chave estrangeira na join table
    await queryRunner.query(`
            ALTER TABLE "property_companies_company"
            ADD CONSTRAINT "FK_property_property_companies_company" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE;
        `);

    await queryRunner.query(`
            ALTER TABLE "property_companies_company"
            ADD CONSTRAINT "FK_company_property_companies_company" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter as mudanças, se necessário
    await queryRunner.query(`DROP TABLE "property_companies_company"`);
    await queryRunner.query(
      `ALTER TABLE "property" ADD COLUMN "companyId" int`
    );
  }
}

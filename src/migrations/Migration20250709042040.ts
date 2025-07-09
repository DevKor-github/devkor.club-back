import { Migration } from "@mikro-orm/migrations";

export class Migration20250709042040 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "posts" alter column "cover_image_url" type text using ("cover_image_url"::text);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "posts" alter column "cover_image_url" type varchar(255) using ("cover_image_url"::varchar(255));`,
    );
  }
}

import { Migration } from "@mikro-orm/migrations";

export class Migration20250709041319 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "posts" add column "cover_image_url" varchar(255) null, add column "view_count" int not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "posts" drop column "cover_image_url", drop column "view_count";`,
    );
  }
}

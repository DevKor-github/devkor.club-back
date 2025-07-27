import { Migration } from '@mikro-orm/migrations';

export class Migration20250727140636 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "posts" add column "token" varchar(255) null;`);
    this.addSql(`alter table "posts" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" drop column "token";`);

    this.addSql(`alter table "posts" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);`);
  }

}

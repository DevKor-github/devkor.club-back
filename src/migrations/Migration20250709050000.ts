import { Migration } from "@mikro-orm/migrations";

export class Migration20250709050000 extends Migration {
  async up(): Promise<void> {
    this.addSql("create index posts_created_at_index on posts (created_at);");
    this.addSql("create index posts_view_count_index on posts (view_count);");
  }

  async down(): Promise<void> {
    this.addSql("drop index posts_created_at_index;");
    this.addSql("drop index posts_view_count_index;");
  }
}

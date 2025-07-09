import { Migration } from '@mikro-orm/migrations';

export class Migration20250709024130 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "posts" ("id" varchar(255) not null, "title" varchar(255) not null, "content" varchar(255) not null, "author" varchar(255) not null, "position" varchar(255) not null, "tags" text[] not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "posts_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "backend_apply" cascade;`);

    this.addSql(`drop table if exists "designer_apply" cascade;`);

    this.addSql(`drop table if exists "front_apply" cascade;`);

    this.addSql(`drop table if exists "pm_apply" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "backend_apply" ("id" serial primary key, "interview_time" int4 not null, "포트폴리오가 있다면, 첨부해주세요!" text null, "name" varchar not null, "email" varchar not null, "phone" varchar not null, "major" varchar not null, "student_id" varchar not null, "본인을 자유롭게 소개해주세요"."" text not null, "Github/개인 블로그 링크" text not null, "본인의 Github 저장소 중 가장 코드 퀄리티가 높" text not null, "과거에 본인이 수행했던 프로젝트나 설계했던" text not null, "특정 서비스 기능을 구현하는 것에서 더 나아가" text not null, "본인이 생각하는 잘하는 BE 개발자는 어떤 개발" text not null, "본인의 개발 실력을 평가하고 평가에 대한 이유" text not null, "지원자분이 개발을 하는 이유와 DevKor에서 성장" text not null);`);

    this.addSql(`create table "designer_apply" ("id" serial primary key, "interview_time" int4 not null, "본인을 자유롭게 소개해주세요"."" text not null, "포트폴리오가 있다면, 첨부해주세요!" text not null, "name" varchar not null, "email" varchar not null, "phone" varchar not null, "major" varchar not null, "student_id" varchar not null, "과거에 디자인했던 프로젝트나 경험에 대해서" text not null, "가장 뛰어나다고 생각하는 본인의 능력을 서술" text not null, "새로운 프로젝트를 시작할 때 어떤 절차로 진행" text not null, "개발자, 프로젝트 매니저 등 다른 팀원과 협업" text not null, "DevKor에서 얻고 싶은 것과 하고 싶은 활동에 대" text not null);`);

    this.addSql(`create table "front_apply" ("id" serial primary key, "interview_time" int4 not null, "본인을 자유롭게 소개해주세요"."" text not null, "Github/개인 블로그 링크" text not null, "name" varchar not null, "email" varchar not null, "phone" varchar not null, "major" varchar not null, "student_id" varchar not null, "포트폴리오가 있다면, 첨부해주세요!" text null, "본인의 Github 저장소 중 가장 코드 퀄리티가 높" text not null, "과거에 본인이 수행했던 프로젝트나 설계했던" text not null, "본인이 생각하는 잘하는 FE 개발자는 어떤 개발" text not null, "본인의 개발 실력을 평가하고 평가에 대한 이유" text not null, "지원자분이 개발을 하는 이유와 DevKor에서 성장" text not null);`);

    this.addSql(`create table "pm_apply" ("id" serial primary key, "interview_time" int4 not null, "본인을 자유롭게 소개해주세요"."" text not null, "포트폴리오가 있다면, 첨부해주세요!" text null, "name" varchar not null, "email" varchar not null, "phone" varchar not null, "major" varchar not null, "student_id" varchar not null, "본인이 어떤 문제를 주도적으로 해결해 본 경험" text not null, "협업해 본 경험(특히 개발자와 디자이너), 그리" text not null, "DevKor에서 얻어가고 싶은 것들, 하고 싶은 활동" text not null);`);

    this.addSql(`drop table if exists "posts" cascade;`);
  }

}

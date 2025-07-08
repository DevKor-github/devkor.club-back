import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostEntity } from "./infrastructures/mikro-orm/post.entity";
import { PostRepositoryImplement } from "./infrastructures/mikro-orm/post.repository.implement";
import { POST_REPOSITORY } from "./infrastructures/post.repository";

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity])],
  providers: [
    {
      provide: POST_REPOSITORY,
      useClass: PostRepositoryImplement,
    },
  ],
  exports: [POST_REPOSITORY],
})
export class PostModule {}

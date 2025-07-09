import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { MikroOrmPostReader } from "@domains/post/infrastructures/mikro-orm/post.reader";
import { MikroOrmPostStore } from "@domains/post/infrastructures/mikro-orm/post.store";
import { POST_READER } from "@domains/post/post.reader";
import { PostService } from "@domains/post/post.service";
import { POST_STORE } from "@domains/post/post.store";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity])],
  providers: [
    {
      provide: POST_READER,
      useClass: MikroOrmPostReader,
    },
    {
      provide: POST_STORE,
      useClass: MikroOrmPostStore,
    },
    PostService,
  ],
  exports: [PostService],
})
export class PostModule {}

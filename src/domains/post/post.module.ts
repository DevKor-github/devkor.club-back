import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { MikroOrmPostReader } from "@domains/post/infrastructures/mikro-orm/post.reader";
import { MikroPostStore } from "@domains/post/infrastructures/mikro-orm/post.store";
import { POST_READER } from "@domains/post/post.reader";
import { PostService } from "@domains/post/post.service";
import { POST_STORE } from "@domains/post/post.store";

@Module({
  imports: [MikroOrmModule.forFeature([PostEntity])],
  providers: [
    {
      provide: POST_READER,
      useClass: MikroOrmPostReader,
    },
    {
      provide: POST_STORE,
      useClass: MikroPostStore,
    },
    PostService,
  ],
  exports: [PostService],
})
export class PostModule {}

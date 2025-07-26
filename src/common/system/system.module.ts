import { LoggerMiddleware } from "@/common/system/middlewares/logger.middleware";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MikroOrmModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60,
      max: 100,
    }),
  ],
  controllers: [],
  providers: [],
})
export class SystemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}

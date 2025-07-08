import { LoggerMiddleware } from "@/common/system/middlewares/logger.middleware";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    MikroOrmModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class SystemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}

import { AppModule } from "@/app.module";
import { HttpExceptionFilter } from "@common/system/filters/httpException.filter";
import { InternalErrorFilter } from "@common/system/filters/internal-error.filter";
import { NotAcceptableException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from "@nestjs/swagger";
import cors from "cors";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("UTC");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new InternalErrorFilter(), new HttpExceptionFilter());
  app.use(
    cors({
      origin: ["http://localhost:5173", "https://devkor.club"],
      // TODO: 배포 후 CORS 설정 변경
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => {
            return `<${error.property}> ${Object.values(error.constraints).join(
              " ",
            )}`;
          })
          .join(" ");
        return new NotAcceptableException(
          `입력값이 유효하지 않습니다 - ${messages}`,
        );
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Devkor.club API")
    .setDescription("Devkor.club API 문서")
    .setVersion("1.0")
    .addTag("devkor")
    .build();
  const options: SwaggerDocumentOptions = {
    autoTagControllers: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup("docs", app, document);
  await app.listen(3071);
}
bootstrap();

import { NotAcceptableException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./httpException.filter";
import { InternalErrorFilter } from "./internal-error.filter";
import cors from "cors";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new InternalErrorFilter(), new HttpExceptionFilter());
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      // TODO: 배포 후 CORS 설정 변경
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => {
            return `<${error.property}> ${Object.values(error.constraints).join(
              " "
            )}`;
          })
          .join(" ");
        return new NotAcceptableException(
          `입력값이 유효하지 않습니다 - ${messages}`
        );
      },
    })
  );
  await app.listen(3050);
}
bootstrap();

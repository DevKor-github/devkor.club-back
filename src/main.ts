import { NotAcceptableException, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { InternalErrorFilter } from "./internal-error.filter";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new InternalErrorFilter());
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
  await app.listen(3050);
}
bootstrap();

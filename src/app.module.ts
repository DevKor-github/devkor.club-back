import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { RecruitModule } from "./applications/recruit/recruit.module";
import { SystemModule } from "@/common/system/system.module";
import { AppController, RecruitController } from "@/presentations/http";

@Module({
  imports: [SystemModule, RecruitModule],
  controllers: [AppController, RecruitController],
  providers: [AppService],
})
export class AppModule {}

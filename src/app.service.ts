import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return new Date().toISOString().substring(0, 10);
  }
}

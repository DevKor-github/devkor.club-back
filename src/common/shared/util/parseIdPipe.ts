import { UniqueEntityId } from "@common/shared/core/domains/uniqueEntityId";
import { PipeTransform } from "@nestjs/common";

export class ParseIdPipe<T extends UniqueEntityId>
  implements PipeTransform<string, T>
{
  constructor(private readonly idClass: new (id: string) => T) {}

  transform(value: string): T {
    return new this.idClass(value);
  }
}

export const parseIdPipe = <T extends UniqueEntityId>(
  idClass: new (id: string) => T
) => new ParseIdPipe(idClass);

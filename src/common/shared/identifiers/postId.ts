import { UniqueEntityId } from "@common/shared/core/domains/uniqueEntityId";

export class PostId extends UniqueEntityId {
  private readonly __brand = "PostId" as const;

  constructor(id?: string | number) {
    super(id);
  }
}

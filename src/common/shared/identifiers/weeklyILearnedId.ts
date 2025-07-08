import { UniqueEntityId } from "@common/shared/core/domains/uniqueEntityId";

export class WeeklyILearnedId extends UniqueEntityId {
  private readonly __brand = "WeeklyILearnedId" as const;

  constructor(id?: string | number) {
    super(id);
  }

  public static create(id: string): WeeklyILearnedId {
    return new WeeklyILearnedId(id);
  }
}

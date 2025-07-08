import { DomainEntity } from "@common/shared/core/domains/domainEntity";
import { UniqueEntityId } from "@common/shared/core/domains/uniqueEntityId";

export type AggregateRootProps = {
  [index: string]: any;
};

export abstract class AggregateRoot<
  T extends AggregateRootProps
> extends DomainEntity<T> {
  protected constructor(props: T, id: UniqueEntityId) {
    super(props, id);
  }
}

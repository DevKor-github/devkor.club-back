import { UniqueEntityId } from "@common/shared/core/domains/uniqueEntityId";

export interface DomainEntityProps {
  [index: string]: any;
}

export abstract class DomainEntity<Props extends DomainEntityProps> {
  protected readonly _id: UniqueEntityId;
  protected props: Props;

  protected constructor(props: Props, id: UniqueEntityId) {
    this._id = id;
    this.props = props;
  }

  get id(): UniqueEntityId {
    return this._id;
  }

  get propsValue(): Props {
    return this.props;
  }

  public equals(other?: DomainEntity<Props>): boolean {
    return this.id.equals(other?.id);
  }
}

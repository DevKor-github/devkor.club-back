export class Page<T> {
  constructor(
    public readonly items: T[],
    public readonly total: number,
    public readonly page: number,
    public readonly size: number,
  ) {}

  get totalPages(): number {
    return Math.ceil(this.total / this.size);
  }

  get hasNext(): boolean {
    return this.page < this.totalPages;
  }

  get hasPrevious(): boolean {
    return this.page > 1;
  }

  static create<T>(
    items: T[],
    total: number,
    page: number,
    size: number,
  ): Page<T> {
    return new Page(items, total, page, size);
  }
}

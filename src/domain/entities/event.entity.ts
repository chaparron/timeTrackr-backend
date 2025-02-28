export class Event {
  private _id: string;
  private props: {
    title: string;
    type: string;
    colleagues: string[];
    dates: { start: string; end?: string }[];
    description?: string;
    totalHours: number;
  };

  constructor(props: {
    title: string;
    type: string;
    colleagues: string[];
    dates: { start: string; end?: string }[];
    description?: string;
  }) {
    this._id = Date.now().toString();
    this.props = { ...props, totalHours: 0 };
    this.props.totalHours = this.calculateTotalHours();
  }


  get id(): string { return this._id }
  get title(): string { return this.props.title }
  get type(): string { return this.props.type }
  get colleagues(): string[] { return this.props.colleagues }
  get dates(): { start: string; end?: string }[] { return this.props.dates }
  get description(): string | undefined { return this.props.description }
  get totalHours(): number { return this.props.totalHours }

  update(props: Partial<Omit<typeof this.props, "totalHours">>): void {
    this.props = {
      ...this.props,
      ...props,
      totalHours: this.calculateTotalHours(),
    };
  }

  calculateTotalHours(): number {
    if (!Array.isArray(this.props.dates) || this.props.dates.length === 0) {
      return 0;
    }
  
    let totalHours = 0;
  
    for (const date of this.props.dates) {
      const start = new Date(date.start).getTime();
      const end = date.end ? new Date(date.end).getTime() : start + 60 * 60 * 1000;
  
      if (isNaN(start) || isNaN(end)) {
        console.warn("Invalid date:", date);
        continue;
      }
  
      totalHours += (end - start) / (1000 * 60 * 60);
    }
  
    return totalHours;
  }
  
}

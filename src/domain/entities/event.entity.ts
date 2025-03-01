export class Event {
  private _id: string;
  private props: {
    title: string;
    type: string;
    colleagues?: string[];
    dates: { start: string; end?: string }[];
    description?: string;
    totalHours: number;
    userId: string;
  };

  constructor(props: {
    title: string;
    type: string;
    colleagues?: string[];
    dates: { start: string; end?: string }[];
    description?: string;
    userId: string;
  }) {
    this.validateProps(props);
    this._id = Date.now().toString();
    this.props = this.initializeProps(props);
  }

  get id(): string { return this._id; }
  get title(): string { return this.props.title; }
  get type(): string { return this.props.type; }
  get colleagues(): string[] | undefined { return this.props.colleagues; }
  get dates(): { start: string; end?: string }[] { return this.props.dates; }
  get description(): string | undefined { return this.props.description; }
  get totalHours(): number { return this.props.totalHours; }
  get userId(): string { return this.props.userId; }

  update(props: Partial<Omit<typeof this.props, "totalHours">>): Event {
    const filteredProps = Object.fromEntries(
      Object.entries(props).filter(([_, value]) => value !== undefined)
    );
    const updatedProps = { ...this.props, ...filteredProps };
    this.validateProps(updatedProps);
    this.props = {
      ...updatedProps,
      totalHours: this.calculateTotalHours(updatedProps.dates),
    };
    return this;
  }

  private initializeProps(props: {
    title: string;
    type: string;
    colleagues?: string[];
    dates: { start: string; end?: string }[];
    description?: string;
    userId: string;
  }) {
    return {
      ...props,
      totalHours: this.calculateTotalHours(props.dates),
    };
  }

  private validateProps(props: {
    title: string;
    type: string;
    colleagues?: string[];
    dates: { start: string; end?: string }[];
    description?: string;
    userId: string;
  }): void {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!props.type || props.type.trim().length === 0) {
      throw new Error('Type is required');
    }
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error('UserId is required');
    }
    if (!props.dates || props.dates.length === 0) {
      throw new Error('At least one date is required');
    }

    for (const dates of props.dates) {
      this.parseAndValidateDates(dates);
    }
  }


  private calculateTotalHours(dates: { start: string; end?: string }[]): number {
    if (!Array.isArray(dates) || dates.length === 0) {
      return 0;
    }

    let totalHours = 0;

    for (const date of dates) {
      const { start, end } = this.parseAndValidateDates(date);
      totalHours += (end - start) / (1000 * 60 * 60);
    }

    return totalHours;
  }

  private parseAndValidateDates(date: { start: string; end?: string }): { start: number; end: number } {
    const start = new Date(date.start).getTime();
    const end = date.end ? new Date(date.end).getTime() : start + 60 * 60 * 1000;

    if (isNaN(start) || isNaN(end)) {
      throw new Error('Invalid date format');
    }

    if (start > end) {
      throw new Error('Start date must be before end date');
    }

    return { start, end };
  }
}
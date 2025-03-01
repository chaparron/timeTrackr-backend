export class User {
    private readonly _id: string;
    private readonly props: {
        email: string;
        username: string;
        passwordHash: string;
    };

    constructor(props: {
        email: string;
        username: string;
        passwordHash: string;
    }) {
        this._id = Date.now().toString();
        this.props = props;
    }

    get id(): string { return this._id; }
    get email(): string { return this.props.email; }
    get username(): string { return this.props.username; }
}
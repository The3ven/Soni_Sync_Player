export class User {
    constructor(
        public userName: string,
        public userId: string,
        public isAdmin: boolean,
        public email: string,
        public gender: string,
        public isActive?: boolean,
        public profilePicture?: string
    ) { }
}
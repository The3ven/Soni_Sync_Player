// export class User {
//   constructor(
//     public email: string,
//     public phone: string,
//     public name?: string,
//     public type?: string,
//     public status?: string,
//     public email_verified?: boolean,
//     public _id?: string
//   ) {}
// }


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
export {};

declare global {
    type NavLinksProps = {
        title: string,
        path: string,
        isHiddenOnSamllDevices: boolean,
    }
    interface IUser {
        role: "user" | "admin",
        _id: string,
        username: string,
        email: string,
        avatar: string,
    }
    type SignInData = {
        email: string,
        password: string
    }
    type GoogleSignInData = {
        email: string | null,
        name: string | null
        avatar: string | null 
    }
}
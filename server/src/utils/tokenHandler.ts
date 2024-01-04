import jwt from "jsonwebtoken"

export const signToken = (id: string) => {
    const token = jwt.sign({ id }, process.env.SECRET_STR as string)
    return token
}
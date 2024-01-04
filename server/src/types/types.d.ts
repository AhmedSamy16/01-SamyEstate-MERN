import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";

export {};

declare global {
    type ControllerFunctionCallback = (req: Request, res: Response, next: NextFunction) => any
    interface IUser extends Document {
        username: string,
        email: string,
        password: string,
        avatar: string,
        role: "user" | "admin"
    }
    interface IListing extends Document {
        name: string,
        description: string,
        address: string,
        regularPrice: number,
        discountPrice: number,
        bathrooms: number,
        bedrooms: number,
        furnished: boolean,
        parking: boolean,
        type: string,
        offer: boolean,
        imageUrls: string[],
        userRef: Types.ObjectId
    }
    type MongooseDocument<T> = T & Document;
    type DecodedTokenType = JwtPayload & { id: string };
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}
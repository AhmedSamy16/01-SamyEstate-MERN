import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constants";

export const signInAsync = createAsyncThunk<IUser, SignInData>(
    "user/signInAsync", 
    async (data: SignInData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            })
            const user = await res.json()
            if (user.status === "failed" || user.status === "error") {
                throw new Error(user.message)
            }
            return user.user
        } catch (error) {
            return rejectWithValue((error as any).message)
        }
})

export const getCurrentUser = createAsyncThunk<IUser>(
    "user/getCuurentUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            const data = await res.json()
            if (data.status === "failed" || data.status === "error") {
                return rejectWithValue(data.message)
            }
            return data.user
        } catch (error) {
            return rejectWithValue((error as Error).message)
        }
    }
)

export const googleSignIn = createAsyncThunk<IUser, GoogleSignInData>(
    "user/googleSignIn",
    async (data: GoogleSignInData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/api/v1/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            })
            const user = await res.json()
            if (user.status === "failed" || user.status === "error") {
                return rejectWithValue(user.message)
            }
            return user.user
        } catch (error) {
            return rejectWithValue("Couldn't Sign in With Google")
        }
    }
)
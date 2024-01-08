import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { 
    signInAsync, 
    getCurrentUser, 
    googleSignIn, 
    signOutAsync ,
    updateUserAsync,
    deleteUserAsync
} from "../actions/user.action";

interface UserSlice {
    user: IUser | null,
    error: string | null,
    loading: boolean
}

const initialState: UserSlice = {
    user: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null
        }
    },
    extraReducers(builder) {
        builder
        .addCase(signInAsync.pending, (state) => {
            state.loading = true
        })
        .addCase(signInAsync.fulfilled, (state, action: PayloadAction<IUser>) => {
            state.loading = false
            state.error = null
            state.user = action.payload
        })
        .addCase(signInAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
            state.user = null
        })
        .addCase(getCurrentUser.pending, (state) => {
            state.loading = true
        })
        .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<IUser>) => {
            state.loading = false
            state.error = null
            state.user = action.payload
        })
        .addCase(getCurrentUser.rejected, (state) => {
            state.loading = false
            state.user = null
        })
        .addCase(googleSignIn.pending, (state) => {
            state.loading = true
        })
        .addCase(googleSignIn.fulfilled, (state, action: PayloadAction<IUser>) => {
            state.loading = false
            state.error = null
            state.user = action.payload
        })
        .addCase(googleSignIn.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
            state.user = null
        })
        .addCase(signOutAsync.pending, (state) => {
            state.loading = true
        })
        .addCase(signOutAsync.fulfilled, (state) => {
            state.loading = false
            state.error = null
            state.user = null
        })
        .addCase(signOutAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
            state.user = null
        })
        .addCase(updateUserAsync.pending, (state) => {
            state.loading = true
        })
        .addCase(updateUserAsync.fulfilled, (state, action: PayloadAction<IUser>) => {
            state.loading = false
            state.error = null
            state.user = action.payload
        })
        .addCase(updateUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
        .addCase(deleteUserAsync.pending, (state) => {
            state.loading = true
        })
        .addCase(deleteUserAsync.fulfilled, (state) => {
            state.loading = false
            state.error = null
            state.user = null
        })
        .addCase(deleteUserAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    },
})

export const selectUser = (state: RootState) => state.user

export const { resetError } = userSlice.actions

export default userSlice.reducer
import { useAppSelector } from "../redux/hooks"
import { selectUser } from "../redux/slices/user.slice"
import { Outlet, Navigate } from "react-router-dom"

const PrivateRoutes = () => {
    const { user, loading } = useAppSelector(selectUser)
    return user || loading ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoutes
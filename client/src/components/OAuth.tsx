import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import app from "../utils/firebase"
import { useAppDispatch } from "../redux/hooks"
import { useNavigate } from "react-router-dom"
import { googleSignIn } from "../redux/actions/user.action"

const OAuth = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const name = result.user.displayName
            const email = result.user.email
            const avatar = result.user.photoURL
            dispatch(googleSignIn({ name, email, avatar }))
                .then(() => {
                    navigate("/")
                })
                .catch(() => console.log())
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <button
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
            type="button"
            onClick={handleGoogleClick}
        >
            Continue With Google
        </button>
    )
}

export default OAuth
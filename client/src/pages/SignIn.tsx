import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signInAsync } from "../redux/actions/user.action"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { selectUser, resetError } from "../redux/slices/user.slice"
import OAuth from "../components/OAuth"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { loading, error } = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(resetError())
    switch (e.target.id) {
      case "email":
        setEmail(e.target.value)
        break;
      case "password":
        setPassword(e.target.value)
        break;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await dispatch(signInAsync({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/")
      })
      .catch(() => console.log())
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange} 
          type="email" 
          placeholder="email"
          className="border p-3 rounded-lg" 
          id="email"
        />
        <input
          onChange={handleChange} 
          type="password" 
          placeholder="password"
          className="border p-3 rounded-lg" 
          id="password" 
        />
        {error && <p className="text-red-500 mt-5">{error}</p>}
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700 hover:underline">Sign up</span>
        </Link>
      </div>
    </div>
  )
}

export default SignIn
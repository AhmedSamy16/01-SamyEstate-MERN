import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import OAuth from "../components/OAuth"

const SignUp = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    switch (e.target.id) {
      case "username":
        setUsername(e.target.value)
        break;
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
    try {
      setIsLoading(true)
      const res = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      })
      const data = await res.json()
      if (data.status === "failed" || data.status === "error") {
        setError(data.message)
        return
      }
      navigate("/sign-in")
    } catch (error) {
      setError((error as Error).message)
      console.log((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange} 
          type="text" 
          placeholder="username"
          className="border p-3 rounded-lg" 
          id="username" 
        />
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
        <button disabled={isLoading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700 hover:underline">Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp
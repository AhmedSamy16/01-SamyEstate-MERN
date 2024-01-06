import { useAppSelector } from "../redux/hooks"
import { selectUser } from "../redux/slices/user.slice"

const Home = () => {
  const { user } = useAppSelector(selectUser)
  console.log(user)
  return (
    <div>Home</div>
  )
}

export default Home
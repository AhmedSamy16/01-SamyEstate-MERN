import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"
import NavItem from "./NavItem"
import { navLinksItems } from "../utils/constants"
import { useAppSelector } from "../redux/hooks"
import { selectUser } from "../redux/slices/user.slice"

const Header = () => {
    const { user } = useAppSelector(selectUser)
    let items = navLinksItems
    if (user) {
        items = navLinksItems.filter(n => n.path !== "/sign-in")
    }
    
  return (
    <header className="bg-slate-200 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to="/">
                <h1 className="font-bold text-base sm:text-2xl flex flex-wrap">
                    <span className="text-slate-500">Samy</span>
                    <span className="text-slate-700">Estate</span>
                </h1>
            </Link>
            <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="bg-transparent focus:outline-none w-24 sm:w-64" 
                />
                <FaSearch className="text-slate-600" />
            </form>
            <ul className="flex gap-4">
                {
                    items.map(item => <NavItem key={item.title} item={item} />)
                }
                {
                    user && (
                        <Link to="/profile">
                            <img 
                                src={user.avatar} 
                                alt="profile" 
                                className="rounded-full h-7 w-7 object-cover"
                            />
                        </Link>
                    )
                }
            </ul>
        </div>
    </header>
  )
}

export default Header
import { Link } from "react-router-dom"

type Props = {
    item: NavLinksProps
}
const NavItem = ({ item }: Props) => {
  return (
    <Link to={item.path}>
        <li className={`${item.isHiddenOnSamllDevices ? "hidden" : ""} sm:inline text-slate-700 hover:underline cursor-pointer`}>
            {item.title}
        </li>
    </Link>
  )
}

export default NavItem
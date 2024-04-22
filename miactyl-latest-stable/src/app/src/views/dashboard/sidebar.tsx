import routes from "@/components/routes"
import { Link } from 'react-router-dom'
import "@/assets/css/sidebar.css"
import { useEffect, useState } from "react"
import UserContext from "@/state/user"
import SystemContenxt from "@/state/system"

export default () => {
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    const user = UserContext.useStoreState(state => state.user);
    const setUser = UserContext.useStoreActions((actions: any) => actions.setUser);
    const [minimized, setMinimized] = useState(user?.sidebar || false)
    useEffect(() => {
        if (window.innerWidth < 1000) setMinimized(true)
    }, [])
    useEffect(() => {
        setMinimized(user?.sidebar)
    }, [user])
    const categories = routes.dashboard.reduce((acc: any, route: any) => {
        if (route.category === 'Hidden') return acc
        if (!acc[route.category]) acc[route.category] = []
        if (route.admin && user.role === 'root_admin') acc[route.category].push(route)
        if (!route.admin) acc[route.category].push(route)
        return acc
    }, {})
    for (const category in categories) {
        if (!categories[category].length) delete categories[category]
    }
    return (
        <div className="sidebar" {...(minimized ? { 'data-minimize': true } : {})}>
            <div className="sidebar__header">
                <h1>{system.name}</h1>
                <div className="sidebar__minimize" onClick={() => setUser({ sidebar: !user.sidebar })}>
                    <i className="fas fa-bars"></i>
                </div>
            </div>
            <ul className="sidebar__menu">
                {Object.keys(categories).map((category, index) => (
                    <li key={index} className="sidebar__menu__category">
                        <h2 className="sidebar__menu__category__title">{category}</h2>
                        <ul className="sidebar__menu__category__list">
                            {categories[category].map((route: any, index: any) => (
                                <Link to={route.path} key={index} {...(route.target ? { target: route.target } : {})}>
                                    <li className='sidebar__menu__category__list__item' {...(route.path === window.location.pathname ? { 'data-active': true } : {})}>
                                        <i className={route.icon}></i> <span>{route.name}</span>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>)
}
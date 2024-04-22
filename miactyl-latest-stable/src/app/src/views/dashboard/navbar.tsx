import React, { useEffect, useState } from 'react';
import Link from '@/api/Link';
import UserContext from '@/state/user';
import '@/assets/css/navbar.css';


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const setUser = UserContext.useStoreActions(actions => actions.setUser);
    const [dropdown, setDropdown] = useState(false);
    useEffect(() => {
        if (dropdown) {
            document.addEventListener('click', (e: any) => {
                if (e.target.closest('.navbar__header__user')) return;
                setDropdown(false);
                document.removeEventListener('click', () => { })
            })
        }
    }, [dropdown])
    return (
        <div className="navbar__header">
            <div className="sidebar__minimize" onClick={() => setUser({
                sidebar: !user.sidebar
            })} data-navbar>
                <i className="fas fa-bars"></i>
            </div>
            <div className="navbar__header__user" onClick={() => setDropdown(!dropdown)}>
                <h2 className="navbar__header__user__username">{user.username}</h2>
                <img src={user.avatar_url} className="navbar__header__user__avatar" />
                <i className="fas fa-caret-down navbar__header__user__dropdown__icon"></i>
                <div className="navbar__header__user__dropdown" data-active={dropdown}>
                    <div className="navbar__header__user__dropdown__item">Coins: {user.coins}</div>
                    <div className="navbar__header__user__dropdown__item">Plan: {user.plan}</div>
                    <a href="/api/miactyl/auth/logout" className="navbar__header__user__dropdown__item">Logout</a>
                </div>
            </div>
        </div>
    )
}
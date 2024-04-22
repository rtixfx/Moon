import '@/assets/css/login.css';
import Link from '@/api/Link';
import discordImg from '@/assets/discord.png';
import SystemContenxt from '@/state/system';
import UserContext from '@/state/user';

import {
    toast
} from 'react-toastify';
import axios from '@/api/axios';
import { useEffect } from 'react';
import { prefix } from '@/components/routes';
import { useNavigate } from 'react-router-dom';
import { TextFooter } from '@/components/footer';

export default () => {
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    const user = UserContext.useStoreState((state: any) => state.user);
    const navigate = useNavigate();
    useEffect(() => {
        document.title = `Login | ${system.name}`;
    }, [system.name]);
    useEffect(() => {
        if (user.id !== '') {
            navigate(prefix + '/');
        }
    }, [user]);

    const discordLogin = () => {
        const channel = new BroadcastChannel('auth');
        let discordLoginPage: Window | null;
        channel.onmessage = () => {
            discordLoginPage?.close();
        }
        discordLoginPage = window.open('/api/miactyl/auth/discord', 'Discord Login', 'width=500,height=800');
    }
    const login = (e: any) => {
        e.preventDefault();
        toast.promise(() => new Promise((resolve, reject) => {
            const email = e.target.email.value;
            const password = e.target.password.value;
            axios.post('/auth/login', { email, password }).then((res) => {
                if (res.data.success) {
                    resolve('Logged in!');
                    new BroadcastChannel('auth').postMessage('auth');
                } else {
                    reject(res.data.error);
                }
            }).catch((e) => {
                if (e.response) {
                    reject(e.response.data.error);
                } else reject(e);
            })
        }),
            {
                pending: 'Logging in...',
                success: 'Logged in!',
                error: {
                    render({ data }: any) {
                        // When the promise reject, data will contains the error
                        return data?.message ? data.message : (data ? data : 'An error occurred while logging in');
                    }
                }
            }
        );
    }
    return (
        <>
            <div id="login" className="login__container">
                <div className="login__container__form">
                    <div className="login__container__form__logo">
                        <img src={system.logo} alt="Logo" />
                    </div>
                    <h2>Welcome to {system.name} 👋</h2>
                    <form className="flex flex-col space-y-4" id="login-form" onSubmit={login}>
                        <div className='login__container__form__input'>
                            <label htmlFor="email">Email Address or Username</label>
                            <input type="text" id="email" name="email" placeholder='Email address or Username' required />
                        </div>
                        <div className='login__container__form__input'>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder='••••••••••••••••' required />
                        </div>
                        <div className='login__container__form__input'>
                            <button type="submit">Login</button>
                        </div>
                        <p>New on our platform? <Link to="/register">Create an account</Link></p>
                        <div className="login__container__form__separator">
                            <div className="spacer"></div><span>OR</span><div className="spacer"></div>
                        </div>
                        <div className="login__container__form__oauth2" onClick={discordLogin}>
                            <div className="login__container__form__oauth2_discord">
                                <img src={discordImg} alt="Discord" />
                            </div>
                        </div>
                    </form>
                </div >
                <span className='footerText'><TextFooter /></span>
            </div >
        </>
    );
}
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


export default () => {
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    const user = UserContext.useStoreState((state: any) => state.user);
    useEffect(() => {
        document.title = `Register | ${system.name}`;
    }, [system.name]);
    useEffect(() => {
        if (user.id !== '') {
            window.location.href = '/';
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
    const register = (e: any) => {
        e.preventDefault();
        toast.promise(() => new Promise((resolve, reject) => {
            const email = e.target.email.value;
            const username = e.target.username.value;
            const password = e.target.password.value;
            axios.post('/auth/register', { email, username, password }).then((res) => {
                if (res.data.success) {
                    resolve('Account created!');
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
                pending: 'Creating account...',
                success: 'Account created!',
                error: {
                    render({ data }: any) {
                        // When the promise reject, data will contains the error
                        return data?.message ? data.message : (data ? data : 'An error occurred while creating an account');
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
                    <h2>Welcome to {system.name}! 👋</h2>
                    <form className="flex flex-col space-y-4" id="login-form" onSubmit={register}>
                        <div className='login__container__form__input'>
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" placeholder='Email address' required />
                        </div>
                        <div className='login__container__form__input'>
                            <label htmlFor="email">Username</label>
                            <input type="text" id="username" name="username" placeholder='Username' required />
                        </div>
                        <div className='login__container__form__input'>
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder='••••••••••••••••' required />
                        </div>
                        <div className='login__container__form__input'>
                            <button type="submit">Sign up</button>
                        </div>
                        <p>Already have an account? <Link to="/login">Login</Link></p>
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
            </div >
        </>
    );
}
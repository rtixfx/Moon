import PublicRouter from "@/components/publicRouter";
import UserContext from "@/state/user";
import SystemContext from "@/state/system";
import routes from '@/components/routes';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loader from "@/components/loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import discord from "@/views/oauth2/discord";
import {
    ToastContainer
} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import DashboardRouter from "@/components/dahboardRouter";
import {
    prefix as UrlPrefix
} from '@/components/routes';
import axios from "@/api/axios";

const App = () => {
    return (
        <BrowserRouter>
            <SystemContext.Provider>
                <UserContext.Provider>
                    <Routes>
                        <Route path={UrlPrefix + "/oauth2/discord"} Component={discord} />
                        <Route path="*" element={<AppPost />} />
                    </Routes>
                </UserContext.Provider>
            </SystemContext.Provider>
        </BrowserRouter>
    );
}


const AppPost = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const setUser = UserContext.useStoreActions((actions: any) => actions.setUser);
    const setSystem = SystemContext.useStoreActions((actions: any) => actions.setSystem);
    useEffect(() => {
        axios.get("/system").then((res) => res.data).then((res) => {
            setSystem(res);
        }).catch((e) => {
            console.log(e);
        })
        setTimeout(() => {
            axios.get("/auth/user").then((res) => res.data).then((res) => {
                if (res.success) {
                    setUser(res.user);
                    console.log(res.user);
                } else {
                    navigate(UrlPrefix + "/login");
                }
                setLoading(false);
            }).catch((e) => {
                console.log(e);
                navigate(UrlPrefix + "/login");
                setLoading(false);
            })
        }, 1000)
    }, [])
    const channel = new BroadcastChannel('auth');
    channel.onmessage = () => {
        setLoading(true);
        setTimeout(() => {
            axios.get("/auth/user").then((res) => res.data).then((res) => {
                if (res.success) {
                    navigate(UrlPrefix + "/");
                    setUser(res.user);
                } else {
                    navigate(UrlPrefix + "/login");
                }
                setLoading(false);
            }).catch((e) => {
                console.log(e);
                navigate(UrlPrefix + "/login");
                setLoading(false);
            })
        }, 1000)
    }
    return (
        <>
            <ToastContainer
                theme="dark"
            />
            <Loader State={loading} Component={() => <Routes>
                {PublicRouter()}
                {DashboardRouter()}
                <Route path="*" element={<routes.fourOFour />} />
            </Routes>} />
        </>
    );
}



export default App;
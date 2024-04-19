import axios from "axios";
import '@/assets/css/discord.css'

export default () => {
    console.log(window.location.search);
    axios.post("/api/miactyl/auth/discord" + window.location.search).then((res) => {
        if (res.data.success) {
            sessionStorage.setItem("token", res.data.token);
            new BroadcastChannel("auth").postMessage({
                success: true,
                token: res.data.token
            });
            window.close();
        } else {
            window.location.href = "/auth/discord";
        }
    }).catch((e) => {
        console.log(e);
        window.location.href = "/auth/discord";
    })
    return (
        <div className="discord__login">
            <h1>Loging in <span>.</span><span>.</span><span>.</span></h1>
        </div>
    );
}
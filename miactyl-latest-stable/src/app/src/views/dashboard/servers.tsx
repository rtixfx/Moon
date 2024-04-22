import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect } from "react";
import Link from "@/api/Link";
import { createModal } from "@/components/createModal";
import { setServers } from "dns";
import { toast } from "react-toastify";
import axios from "@/api/axios";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const setUser = UserContext.useStoreActions((actions: any) => actions.setUser);
    const system = SystemContenxt.useStoreState((state) => state.system);
    useEffect(() => {
        document.title = `Servers | ${system.name}`;
    }, [system.name]);

    return (
        <div className="dashboard">
            <div className="servers__row">
                {
                    user.attributes.relationships.servers.data.map((server: any) => {
                        return (
                            <div className="servers__row__item">
                                <h4 className="servers__row__item-title">{server.attributes.name}</h4>
                                <h5 className="servers__row__item-subtitle">Server {server.attributes.uuid}</h5>
                                <p><i className="fas fa-microchip"></i> CPU: {server.attributes.limits.cpu.toFixed(0) / 100} Core(s)</p>
                                <p><i className="fas fa-memory"></i> RAM: {server.attributes.limits.memory.toFixed(0) / 1024} GB(s)</p>
                                <p><i className="fas fa-hdd"></i> Disk: {server.attributes.limits.disk.toFixed(0) / 1024} GB(s)</p>
                                <p><i className="fas fa-server"></i> Status: {server.attributes.locked ?
                                    server.attributes.locked :
                                    server.attributes.suspended ?
                                        "Suspended" :
                                        server.attributes.renew === 0 ?
                                            'No Expire' :
                                            !server.attributes.renew ?
                                                'No Expire' :
                                                new Date().getTime() > server.attributes.renew ?
                                                    'Suspension Pending' :
                                                    new Date(server.attributes.renew).getDate() + '/' + (new Date(server.attributes.renew).getMonth() + 1) + '/' + new Date(server.attributes.renew).getFullYear() === new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() ?
                                                        new Date(server.attributes.renew).getHours() + ':' + new Date(server.attributes.renew).getMinutes() :
                                                        new Date(server.attributes.renew).getDate() + '/' + (new Date(server.attributes.renew).getMonth() + 1) + '/' + new Date(server.attributes.renew).getFullYear()
                                }
                                </p>
                                <div className="servers__row__item-buttons">
                                    <p className="servers__row__item-button"><Link to={`/server/${server.attributes.uuid}`}>Edit Server</Link></p>
                                    <p className="servers__row__item-button" data-secondary><Link to={`/server/${server.attributes.uuid}/renew`}>Renew Server</Link></p>
                                    <p className="servers__row__item-button link" data-danger><a onClick={() => {
                                        const d = new BroadcastChannel('server')
                                        d.onmessage = (e) => {
                                            const data = e.data;
                                            if (data.action === 'delete') {
                                                d.close();
                                                toast.promise(axios.delete(`/server/${data.id}`).then((res) => {
                                                    if (!res.data.success) throw new Error(res.data.error);
                                                    setUser({
                                                        attributes: {
                                                            relationships: {
                                                                servers: {
                                                                    data: user.attributes.relationships.servers.data.filter((server: any) => {
                                                                        return server.attributes.uuid !== data.id
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    })
                                                }), {
                                                    pending: 'Deleting image...',
                                                    success: 'Image deleted successfully!',
                                                    error: {
                                                        render({ data }: any) {
                                                            // When the promise reject, data will contains the error
                                                            return data?.message ? data.message : (data ? data : 'An error occurred while deleting the image');
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                        createModal('Are you sure you want to delete ' + server.attributes.name + '?', [{
                                            name: 'Yes', action: `new BroadcastChannel('server').postMessage({ action: 'delete', id: '${server.attributes.uuid}' }); document.querySelector('.modal').style.opacity = '0'; setTimeout(() => document.body.removeChild(document.querySelector('.modal')), 300)`,
                                            data: { danger: true }
                                        }])
                                    }}>Delete Server</a></p>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="servers__row__item">
                    <h4 className="servers__row__item-title">Create a new server</h4>
                    <h2>Click the button below to create a new server.</h2>
                    <div className="servers__row__item-buttons" style={{ justifyContent: 'center' }}>
                        <p className="servers__row__item-button"><Link to="/servers/create">Create Server</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )

}
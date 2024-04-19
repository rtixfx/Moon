import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect } from "react";
import Link from "@/api/Link";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const system = SystemContenxt.useStoreState((state: any) => state.system);
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
                                    <p className="servers__row__item-button" data-danger><Link to={`/server/${server.attributes.uuid}/delete`}>Delete Server</Link></p>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="servers__row__item">
                    <h4 className="servers__row__item-title">Create a new server</h4>
                    <h2>Click the button below to create a new server.</h2>
                    <div className="servers__row__item-buttons" style={{ justifyContent: 'center' }}>
                        <p className="servers__row__item-button"><Link to="/server/create">Create Server</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )

}
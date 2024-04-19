import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect } from "react";
import Link from "@/api/Link";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    useEffect(() => {
        document.title = `Dashboard | ${system.name}`;
    }, [system.name]);

    return (
        <div className="dashboard">
            <h3>View your resources & other things here.</h3>
            <div className="dashboard__row">
                <div className="dashboard__row__item">
                    <h6>Your CPU</h6>
                    <h3>{user.attributes.relationships.servers.data.reduce((acc: any, server: any) => acc + server.attributes.limits.cpu / 100, 0).toFixed(0)} / {user.cpu} Core(s)</h3>
                </div>
                <div className="dashboard__row__item">
                    <h6>Your Ram</h6>
                    <h3>{user.attributes.relationships.servers.data.reduce((acc: any, server: any) => acc + server.attributes.limits.memory / 1024, 0).toFixed(0)} / {user.ram} GB(s)</h3>
                </div>
                <div className="dashboard__row__item">
                    <h6>Your Disk</h6>
                    <h3>{user.attributes.relationships.servers.data.reduce((acc: any, server: any) => acc + server.attributes.limits.disk / 1024, 0).toFixed(0)} / {user.disk} GB(s)</h3>
                </div>
                <div className="dashboard__row__item">
                    <h6>Your Slots</h6>
                    <h3>{user.attributes.relationships.servers.data.length} / {user.slots}</h3>
                </div>
            </div>
            <div className="dashboard__servers-list">
                <h4 className="dashboard__servers-list-title">Server Information</h4>
                <div className="dashboard__servers-list-table-responsive">

                    <table className="dashboard__servers-list-table">
                        <thead>
                            <tr>
                                <th>Server Name</th>

                                <th>CPU</th>
                                <th>RAM</th>
                                <th>Disk</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.attributes.relationships.servers.data.map((server: any, index: any) => (
                                    <tr key={index}>
                                        <td>{server.attributes.name} {server.attributes.locked && <strong style={{ color: 'red' }}>Locked</strong>}</td>
                                        <td>{server.attributes.limits.cpu === 0 ? 'Unlimited' : server.attributes.limits.cpu.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " %"} </td>
                                        <td>{server.attributes.limits.memory === 0 ? 'Unlimited' : server.attributes.limits.memory.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " MB"}</td>
                                        <td>{server.attributes.limits.disk === 0 ? 'Unlimited' : server.attributes.limits.disk.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " MB"}</td>
                                        <td>
                                            {server.attributes.locked ?
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
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
            </div>
            <style>{`


                `}
            </style>
        </div>
    )

}
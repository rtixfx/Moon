import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect } from "react";
import Link from "@/api/Link";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const system = SystemContenxt.useStoreState((state: any) => state.system);
    useEffect(() => {
        document.title = `Transactions | ${system.name}`;
    }, [system.name]);

    return (
        <div className="dashboard">
            <h3>View your transactions here.</h3>
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
                <h4 className="dashboard__servers-list-title">Transactions</h4>
                <div className="dashboard__servers-list-table-responsive">

                    <table className="dashboard__servers-list-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Created At</th>
                                <th>Support</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                user.attributes.transactions.map((transaction: any, index: any) => (
                                    <tr key={index}>
                                        <td>{transaction.id.toString().padStart(6, '0')}</td>
                                        <td>{transaction.item}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>{transaction.price}</td>
                                        <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                        <td className="supportButton"><Link to={`/support/${transaction.id}`}>Support</Link></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}
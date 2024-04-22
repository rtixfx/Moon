import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import SystemContenxt from '@/state/system';

export default () => {
    const system = SystemContenxt.useStoreState((state) => state.system);
    const [nodes, setNodes] = useState(system.nodes);
    useEffect(() => {
        setNodes(nodes.sort((a, b) => a.sort - b.sort));
    }, [nodes])
    return (
        <div className="dashboard">
            <div className="dashboard__servers-list">
                <h4 className="dashboard__servers-list-title">Nodes</h4>
                <div className="dashboard__servers-list-table-responsive">

                    <table className="dashboard__servers-list-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Plan</th>
                                <th>Possition</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                nodes.map((node: any, index: any) => (
                                    <tr key={index}>
                                        <td>{node.id}</td>
                                        <td>{node.name}</td>
                                        <td>{node.plan}</td>
                                        <td>{node.sort}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}
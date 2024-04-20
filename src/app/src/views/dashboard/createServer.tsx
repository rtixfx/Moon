import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect, useState } from "react";
import Link from "@/api/Link";
import { toast } from "react-toastify";
import axios from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { prefix as urlPrefix } from "@/components/routes";


export default () => {
    const navigation = useNavigate();
    const user = UserContext.useStoreState(state => state.user);
    const setUser = UserContext.useStoreActions(actions => actions.setUser);
    const system = SystemContenxt.useStoreState((state) => state.system);
    useEffect(() => {
        document.title = `Servers | ${system.name}`;
    }, [system.name]);
    const [inputData, setInputData] = useState({
        name: '',
        cores: 1,
        memory: 1,
        disk: 1,
        ports: 0,
        databases: 0,
        backups: 0,
        image: 1
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        toast.promise(axios.post('/server', data).then((res) => {
            if (!res.data.success) throw new Error(res.data.error);
            new BroadcastChannel('auth').postMessage('server');
            navigation(urlPrefix + '/servers');
        }), {
            pending: 'Creating server...',
            success: 'Server created successfully!',
            error: {
                render({ data }: any) {
                    // When the promise reject, data will contains the error
                    return data?.message ? data.message : (data ? data : 'An error occurred while creating the server');
                }
            }
        })
    }

    return (
        <div className="dashboard">
            <h4 className="dashboard__servers-list-title">Servers</h4>
            <div className="dashboard__form">
                <form onSubmit={handleSubmit}>
                    <h2>Create a new server</h2>
                    <div className="dashboard__form-input">
                        <label>Server Name</label>
                        <input type="text" placeholder="My Server" name="name" onChange={(e) => setInputData({ ...inputData, name: e.target.value })} value={inputData.name} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>CPU Core(s):</label>
                        <input type="number" placeholder="1" name="cores" onChange={(e) => setInputData({ ...inputData, cores: parseInt(e.target.value) })} value={inputData.cores} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Ram (GB):</label>
                        <input type="number" placeholder="1" name="memory" onChange={(e) => setInputData({ ...inputData, memory: parseInt(e.target.value) })} value={inputData.memory} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Disk (GB):</label>
                        <input type="number" placeholder="1" name="disk" onChange={(e) => setInputData({ ...inputData, disk: parseInt(e.target.value) })} value={inputData.disk} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Ports:</label>
                        <input type="number" placeholder="1" name="ports" onChange={(e) => setInputData({ ...inputData, ports: parseInt(e.target.value) })} value={inputData.ports} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Databases:</label>
                        <input type="number" placeholder="0" name="databases" onChange={(e) => setInputData({ ...inputData, databases: parseInt(e.target.value) })} value={inputData.databases} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Backups:</label>
                        <input type="number" placeholder="0" name="backups" onChange={(e) => setInputData({ ...inputData, backups: parseInt(e.target.value) })} value={inputData.backups} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Image:</label>
                        <select name="image" onChange={(e) => setInputData({ ...inputData, image: parseInt(e.target.value) })} value={inputData.image}>
                            {
                                system.images.map((image) => (
                                    <option key={image.id} value={image.id}>{image.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="dashboard__form-input">
                        <input type="submit" value={"Create Server" + (system.deployCost ? ` - ${system.deployCost + (inputData.cores * system.deployCostAddition.cpu + inputData.memory * system.deployCostAddition.ram + inputData.disk * system.deployCostAddition.disk + inputData.ports * system.deployCostAddition.ports + inputData.databases * system.deployCostAddition.databases + inputData.backups * system.deployCostAddition.backups)} Coins` : '')} />
                    </div>
                </form>
            </div>
        </div>
    )

}
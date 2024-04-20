import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect, useState } from "react";
import Link from "@/api/Link";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const system = SystemContenxt.useStoreState((state) => state.system);
    useEffect(() => {
        document.title = `Servers | ${system.name}`;
    }, [system.name]);
    const [inputData, setInputData] = useState({
        cores: 0,
        memory: 0,
        disk: 0,
        ports: 0,
        databases: 0,
        backups: 0,
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const data = {
            name: e.target.name.value,
            cores: e.target.cores.value,
            memory: e.target.memory.value,
            disk: e.target.disk.value,
            ports: e.target.ports.value,
            databases: e.target.databases.value,
            backups: e.target.backups.value,
            egg: e.target.egg.value
        }
        console.log(data);
    }

    return (
        <div className="dashboard">
            <h4 className="dashboard__servers-list-title">Servers</h4>
            <div className="dashboard__form">
                <form onSubmit={handleSubmit}>
                    <h2>Create a new server</h2>
                    <div className="dashboard__form-input">
                        <label>Server Name</label>
                        <input type="text" placeholder="My Server" name="name" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>CPU Core(s):</label>
                        <input type="number" placeholder="1" name="cores" onChange={(e) => setInputData({ ...inputData, cores: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Ram (GB):</label>
                        <input type="number" placeholder="1" name="memory" onChange={(e) => setInputData({ ...inputData, memory: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Disk (GB):</label>
                        <input type="number" placeholder="1" name="disk" onChange={(e) => setInputData({ ...inputData, disk: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Ports:</label>
                        <input type="number" placeholder="1" name="ports" onChange={(e) => setInputData({ ...inputData, ports: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Databases:</label>
                        <input type="number" placeholder="0" name="databases" onChange={(e) => setInputData({ ...inputData, databases: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Backups:</label>
                        <input type="number" placeholder="0" name="backups" onChange={(e) => setInputData({ ...inputData, backups: parseInt(e.target.value) })} />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Pterodactyl Egg:</label>
                        <select name="egg">
                            {
                                system.images.map((image) => (
                                    <option key={image.id}>{image.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="dashboard__form-input">
                        <input type="submit" value={"Create Server" + (system.deployCost ? ` - ${system.deployCost * (inputData.cores * system.deployCostAddition.cpu + inputData.memory * system.deployCostAddition.ram + inputData.disk * system.deployCostAddition.disk + inputData.ports * system.deployCostAddition.ports + inputData.databases * system.deployCostAddition.databases + inputData.backups * system.deployCostAddition.backups)}$` : '')} />
                    </div>
                </form>
            </div>
        </div>
    )

}
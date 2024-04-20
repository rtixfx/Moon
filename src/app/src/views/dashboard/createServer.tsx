import UserContext from "@/state/user";
import SystemContenxt from "@/state/system";
import '@/assets/css/dashboard.css';
import { useEffect } from "react";
import Link from "@/api/Link";


export default () => {
    const user = UserContext.useStoreState(state => state.user);
    const system = SystemContenxt.useStoreState((state) => state.system);
    useEffect(() => {
        document.title = `Servers | ${system.name}`;
    }, [system.name]);

    return (
        <div className="dashboard">
            <div className="dashboard__form">
                <div className="dashboard__form-input">
                    <label>Server Name</label>
                    <input type="text" placeholder="My Server" />
                </div>
                <div className="dashboard__form-input">
                    <label>CPUS (Cores):</label>
                    <input type="number" placeholder="1" />
                </div>
                <div className="dashboard__form-input">
                    <label>Memory (GB):</label>
                    <input type="number" placeholder="1" />
                </div>
                <div className="dashboard__form-input">
                    <label>Disk (GB):</label>
                    <input type="number" placeholder="1" />
                </div>
                <div className="dashboard__form-input">
                    <label>Location:</label>
                    <select>
                        {
                            system.nodes.sort((a, b) => a.sort - b.sort).map((node: any) => (
                                <option key={node.id}>{node.plan} - {node.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="dashboard__form-input">
                    <label>Image:</label>
                    <select>
                        {
                            system.images.sort((a, b) => a.sort - b.sort).map((image: any) => (
                                <option key={image.id}>{image.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="dashboard__form-input">
                    <input type="submit" value="Create Server" />
                </div>
            </div>
        </div>
    )

}
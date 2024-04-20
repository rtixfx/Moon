import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import SystemContenxt from '@/state/system';
import Link from '@/api/Link';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { prefix as UrlPrefix } from '@/components/routes';

export default () => {
    const navigation = useNavigate();
    const system = SystemContenxt.useStoreState((state) => state.system);
    const [nests, setNests] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            axios.get('/admin/eggs').then((res) => {
                console.log(res.data.data);
                setNests(res.data.data);
            }).catch((e) => {
                console.error(e);
            })
        }, 1000)
    }, [])
    const handleSubmit = (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        toast.promise(axios.post('/admin/images', data).then((res) => {
            if (!res.data.success) throw new Error(res.data.error);
            navigation(UrlPrefix + '/admin/images');
        }), {
            pending: 'Creating image...',
            success: 'Image created successfully!',
            error: {
                render({ data }: any) {
                    // When the promise reject, data will contains the error
                    return data?.message ? data.message : (data ? data : 'An error occurred while logging in');
                }
            }
        })
    }

    return (
        <div className="dashboard">
            <h4 className="dashboard__servers-list-title">Images</h4>
            <div className="dashboard__form">
                <form onSubmit={handleSubmit}>
                    <h2>Create a new image</h2>
                    <div className="dashboard__form-input">
                        <label>Image Name</label>
                        <input type="text" placeholder="Minecraft - Server" name="name" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Cores:</label>
                        <input type="number" placeholder="1" name="cores" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Memory (GB):</label>
                        <input type="number" placeholder="1" name="memory" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Disk (GB):</label>
                        <input type="number" placeholder="1" name="disk" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Ports:</label>
                        <input type="number" placeholder="1" name="ports" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Databases:</label>
                        <input type="number" placeholder="0" name="databases" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Max Backups:</label>
                        <input type="number" placeholder="0" name="backups" />
                    </div>
                    <div className="dashboard__form-input">
                        <label>Pterodactyl Egg:</label>
                        <select name="egg">
                            {
                                nests.map((nest: any) => (
                                    nest.attributes.relationships.eggs.data.map((egg: any) => (
                                        <option key={egg.attributes.id} value={egg.attributes.id}>{nest.attributes.name} - {egg.attributes.name}</option>
                                    ))
                                ))
                            }
                        </select>
                    </div>
                    <div className="dashboard__form-input">
                        <input type="submit" value="Create Server" />
                    </div>
                </form>
            </div>
        </div>
    )
}
import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import SystemContenxt from '@/state/system';

export default () => {
    const system = SystemContenxt.useStoreState((state) => state.system);
    const [images, setImages] = useState([]);
    useEffect(() => {
        axios.get('/admin/images').then((res) => {
            setImages(res.data.data);
        }).catch((e) => {
            console.error(e);
        })
    }, [])

    return (
        <div className="dashboard">
            <div className="dashboard__servers-list">
                <h4 className="dashboard__servers-list-title">Images</h4>
                <div className="dashboard__servers-list-table-responsive">

                    <table className="dashboard__servers-list-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                images.map((image: any, index: any) => (
                                    <tr key={index}>
                                        <td>{image.id}</td>
                                        <td>{image.name}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    {images.length === 0 && <div className="dashboard__loader">
                        <div className="loader__circle"></div>
                        <h2>Loading...</h2>
                    </div>}
                </div>
            </div >
        </div>
    )
}
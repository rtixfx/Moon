import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import SystemContenxt from '@/state/system';

export default () => {
    const system = SystemContenxt.useStoreState((state) => state.system);
    const [images, setImages] = useState(null);
    useEffect(() => {
        setTimeout(() => {
            axios.get('/admin/images').then((res) => {
                console.log(res.data);
                setImages(res.data.data);
            }).catch((e) => {
                console.error(e);
            })
        }, 1000)
    }, [])

    return (
        <div className="dashboard">
            <h4 className="dashboard__servers-list-title">Images</h4>
            {images === null && <div className="dashboard__loader">
                <div className="loader__circle"></div>
                <h2>Loading...</h2>
            </div>}
            <div className="servers__row">
                {
                    images !== null &&
                    images.map((image: any) => {
                        return (
                            <div className="servers__row__item">
                                <h4 className="servers__row__item-title">{image.name}</h4>
                                <h5 className="servers__row__item-subtitle">Image {image.id}</h5>
                                <p><i className="fas fa-sort-numeric-up"></i> Sort: {image.sort}</p>
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}
import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import SystemContenxt from '@/state/system';
import Link from '@/api/Link';
import { toast } from 'react-toastify';
import { createModal } from '@/components/createModal';

export default () => {
    const system = SystemContenxt.useStoreState((state) => state.system);
    const [images, setImages] = useState<any>(null);
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
                                <div className="servers__row__item-buttons">
                                    <p className="servers__row__item-button"><Link to={`/admin/images/${image.id}`}>Edit Image</Link></p>
                                    <p className="servers__row__item-button" data-danger><a onClick={() => {
                                        const d = new BroadcastChannel('image')
                                        d.onmessage = (e) => {
                                            const data = e.data;
                                            if (data.action === 'delete') {
                                                d.close();
                                                toast.promise(axios.delete(`/admin/images/${data.id}`).then((res) => {
                                                    if (!res.data.success) throw new Error(res.data.error);
                                                    setImages((prev: any) => prev.filter((image: any) => image.id !== data.id));
                                                }), {
                                                    pending: 'Deleting image...',
                                                    success: 'Image deleted successfully!',
                                                    error: {
                                                        render({ data }: any) {
                                                            // When the promise reject, data will contains the error
                                                            return data?.message ? data.message : (data ? data : 'An error occurred while deleting the image');
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                        createModal('Are you sure you want to delete this image?', [{
                                            name: 'Yes', action: `new BroadcastChannel('image').postMessage({ action: 'delete', id: ${image.id} }); document.querySelector('.modal').style.opacity = '0'; setTimeout(() => document.body.removeChild(document.querySelector('.modal')), 300)`,
                                            data: { danger: true }
                                        }])
                                    }}>Delete Image</a></p>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="servers__row__item">
                    <h4 className="servers__row__item-title">Create a new image</h4>
                    <h2>Click the button below to create a new image.</h2>
                    <div className="servers__row__item-buttons" style={{ justifyContent: 'center' }}>
                        <p className="servers__row__item-button"><Link to="/admin/images/create">Create Image</Link></p>
                    </div>
                </div>
            </div>

        </div>
    )
}
import routes from '@/components/routes';
import Sidebar from '@/views/dashboard/sidebar';
import { Route } from 'react-router-dom';
import Navbar from '@/views/dashboard/navbar';
import {
    FullFooter as Footer
} from './footer';

export default function DashboardRouter() {

    return (
        routes.dashboard.map((route: any, index: any) => (
            <Route
                key={index}
                path={route.path}
                Component={
                    () => {
                        return (<>
                            <div className="sideRender">
                                <Sidebar />
                                <Navbar />
                                <div className="sideRender__container">
                                    <div className='navSpacer'></div>
                                    <route.component />
                                </div>
                                <Footer />
                            </div>
                        </>
                        )
                    }
                }
            />
        ))
    )
}
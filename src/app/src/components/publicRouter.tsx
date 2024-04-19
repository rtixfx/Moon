import routes from '@/components/routes';
import { Route } from 'react-router-dom';

export default function PublicRouter() {
    return (routes.public.map((route, index) => (
        <Route
            key={index}
            path={route.path}
            Component={route.component}
        />
    ))
    )
}
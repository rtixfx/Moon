import { Link as Ln } from 'react-router-dom';
import {
    prefix as UrlPrefix
} from '@/components/routes';

export default function Link({ to, children }: any) {
    return (
        <Ln to={UrlPrefix + to}>{children}</Ln>
    )
}
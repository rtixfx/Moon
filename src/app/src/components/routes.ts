import Login from '@/views/login';
import Register from '@/views/register';
import FourOFRour from '@/views/404';
import Dashboard from '@/views/dashboard/dashboard';
import Transactions from '@/views/dashboard/transactions';
import Servers from '@/views/dashboard/servers';
import CreateServer from '@/views/dashboard/createServer';
import Nodes from '@/views/admin/Nodes';
import Images from '@/views/admin/Images';
export const prefix = '/client';

export default {
    fourOFour: FourOFRour,
    public: [
        {
            path: prefix + '/login',
            component: Login
        },
        {
            path: prefix + '/register',
            component: Register
        }
    ],
    dashboard: [
        {
            path: prefix + '/',
            component: Dashboard,
            name: 'Dashboard',
            icon: 'fas fa-tachometer-alt green',
            category: 'Management',
        },
        {
            path: prefix + '/transactions',
            component: Transactions,
            name: 'Transactions',
            icon: 'fas fa-exchange-alt blue',
            category: 'Management',
        },
        {
            path: prefix + '/servers',
            component: Servers,
            name: 'Your Servers',
            icon: 'fas fa-server purple',
            category: 'Management',
        },
        {
            path: prefix + '/servers/create',
            component: CreateServer,
            name: 'Create Server',
            icon: 'fas fa-plus-circle red',
            category: 'Hidden',
        },
        {
            path: prefix + '/account',
            component: Dashboard,
            name: 'Account Settings',
            icon: 'fas fa-gear orange',
            category: 'Management',
        },
        {
            path: prefix + '/store',
            component: Dashboard,
            name: 'Resources Store',
            icon: 'fas fa-store blue',
            category: 'Coins & Resources',
        },
        {
            path: prefix + '/redeem',
            component: Dashboard,
            name: 'Redeem Coupon',
            icon: 'fas fa-certificate purple',
            category: 'Coins & Resources',
        },
        {
            path: prefix + '/j4r',
            component: Dashboard,
            name: 'Join for Rewards',
            icon: 'fas fa-gift red',
            category: 'Coins & Resources',
        },
        {
            path: prefix + '/earn',
            component: Dashboard,
            name: 'Earn Coins',
            icon: 'fas fa-coins green',
            category: 'Coins & Resources',
        },
        {
            path: 'https://dash.firecone.eu',
            target: '_blank',
            component: Dashboard,
            name: 'Panel',
            icon: 'fas fa-cogs blue',
            category: 'Miscellaneous',
        },
        {
            path: prefix + '/admin/users',
            component: Dashboard,
            name: 'Users',
            icon: 'fas fa-users red',
            category: 'Admin',
            admin: true
        },
        {
            path: prefix + '/admin/nodes',
            component: Nodes,
            name: 'Nodes',
            icon: 'fas fa-server green',
            category: 'Admin',
            admin: true
        },
        {
            path: prefix + '/admin/servers',
            component: Dashboard,
            name: 'Servers',
            icon: 'fas fa-server orange',
            category: 'Admin',
            admin: true
        },
        {
            path: prefix + '/admin/images',
            component: Images,
            name: 'Images',
            icon: 'fas fa-compact-disc blue',
            category: 'Admin',
            admin: true
        }
    ]
}
const routes = [
    {
        component: require('./pages/ProfilePage').default,
        name: 'Profile',
        path: '/profile/:userID?',
        exact: true,
    },
    {
        component: require('./pages/InboxPage').default,
        name: 'Inbox',
        path: '/inbox',
        exact: true,
    },
    {
        component: require('./pages/RequestsPage').default,
        name: 'Requests',
        path: '/requests',
        exact: true,
    },
    {
        component: require('./pages/FavouritesPage').default,
        name: 'Favourites',
        path: '/favourites',
        exact: true,
    },
    {
        component: require('./pages/LoginRegisterPage').default,
        name: 'Sign Out',
        path: '/',
        exact: true,
    },
    {
        component: require('./pages/LoginRegisterPage').default,
        path: '/',
    },
];

export default routes;
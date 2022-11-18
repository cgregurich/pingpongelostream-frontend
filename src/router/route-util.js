import {
    noLoginRequired, loginNotRequired, loginRequired,
    publicRoutes, privateRoutes
} from './routes';

function isRoutePublic({ name }) {
    return publicRoutes.findIndex(
        r => r.name == name
    ) >= 0;
}

function getNoLoginRequiredRoutes() {
    return noLoginRequired;
}
function getLoginNotRequiredRoutes() {
    return loginNotRequired;
}
function getLoginRequiredRoutes() {
    return loginRequired;
}
function getPublicRoutes() {
    return publicRoutes;
}
function getPrivateRoutes() {
    return privateRoutes;
}
function getAllRoutes() {
    return [
        ...getPublicRoutes(),
        ...getPrivateRoutes()
    ];
}

export {
    isRoutePublic,
    getNoLoginRequiredRoutes,
    getLoginNotRequiredRoutes,
    getLoginRequiredRoutes,
    getPublicRoutes,
    getPrivateRoutes,
    getAllRoutes
};

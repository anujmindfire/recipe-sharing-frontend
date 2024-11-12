import Following from './following'
import authenicateRoute from '../../utils/authenticatedRouteGuard';

const Follower = () => {
    return (
        <Following />
    )
}

export default authenicateRoute(Follower);
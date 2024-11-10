import Recipes from './recipes'
import authenicateRoute from '../../utils/authenticatedRouteGuard';

const FavouriteRecipe = () => {
    return (
        <Recipes />
    )
}

export default authenicateRoute(FavouriteRecipe);
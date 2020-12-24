import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { LOGIN } from "~/constants/routes";
import { IRootReducer } from "~/types/types";

interface IProps {
    component: React.ComponentType;
    path: string;
    [propName: string]: any;
}

const ProtectedRoute: React.FC<IProps> = ({ component: Component, path, ...rest }) => {
    const { isAuth } = useSelector((state: IRootReducer) => ({
        isAuth: !!state.auth.id && !!state.auth.username
    }));

    return (
        <Route
            {...rest}
            component={(props: any) => {
                return isAuth ? <Component {...props} /> : <Redirect to={LOGIN} />
            }}
        />
    );
}

export default ProtectedRoute;

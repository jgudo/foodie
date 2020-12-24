import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { HOME } from "~/constants/routes";
import { IRootReducer } from "~/types/types";

interface IProps {
    component: React.ComponentType;
    path: string;
    [propName: string]: any;
}

const PublicRoute: React.FC<IProps> = ({ component: Component, path, ...rest }) => {
    const { isAuth } = useSelector((state: IRootReducer) => ({
        isAuth: !!state.auth.id && !!state.auth.username
    }));

    return (
        <Route
            {...rest}
            component={(props: any) => {
                return isAuth ? <Redirect to={HOME} /> : <Component {...props} />
            }}
        />
    );
}

export default PublicRoute;

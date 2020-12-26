import { Redirect, Route } from "react-router-dom";
import withAuth from "~/components/hoc/withAuth";
import { LOGIN } from "~/constants/routes";

interface IProps {
    component: React.ComponentType;
    path: string;
    isAuth: boolean;
    [propName: string]: any;
}

const ProtectedRoute: React.FC<IProps> = ({ isAuth, component: Component, path, ...rest }) => {
    return (
        <Route
            {...rest}
            component={(props: any) => {
                return isAuth ? <Component {...props} /> : <Redirect to={LOGIN} />
            }}
        />
    );
}

export default withAuth(ProtectedRoute);

import { Redirect, Route } from "react-router-dom";
import withAuth from "~/components/hoc/withAuth";
import { HOME } from "~/constants/routes";
import { RouteProps} from "react-router";
import { FC } from "react";

interface IProps extends RouteProps{
    component: any;
    isAuth: boolean;
}

const PublicRoute: FC<IProps> = ({ isAuth, component: Component, path, ...rest }) => {
    return (
        <Route
            {...rest}
            component={(props: any) => {
                return isAuth ? <Redirect to={HOME} /> : <Component {...props} />
            }}
        />
    );
};

export default withAuth(PublicRoute);

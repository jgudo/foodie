import { Redirect, Route } from "react-router-dom";
import withAuth from "~/components/hoc/withAuth";
import { LOGIN } from "~/constants/routes";
import Profile from "~/pages/profile";

interface IProps {
    component: React.ComponentType;
    path: string;
    isAuth: boolean;
    [propName: string]: any;
}

const ProfileRoute: React.FC<IProps> = ({ isAuth, component: Component, path, ...rest }) => {
    return (
        <Route
            {...rest}
            component={(props: any) => {
                return isAuth ? (
                    <Profile>
                        <Component {...props} />
                    </Profile>
                ) : <Redirect to={LOGIN} />
            }}
        />
    );
}

export default withAuth(ProfileRoute);

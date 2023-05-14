import { useSelector } from "react-redux"
import { IRootReducer } from "~/types/types"

interface IInjectedProps {
    isAuth: boolean;
}

const withAuth = <P extends IInjectedProps>(Component: any) => {
    return (props: any) => {
        const isAuth = useSelector((state: IRootReducer) => !!state.auth.id && !!state.auth.username);

        return <Component {...props as P} isAuth={isAuth} />
    }
};

export default withAuth;


import { useSelector } from "react-redux"
import { IRootReducer } from "~/types/types"

interface IInjectedProps {
    isAuth: boolean;
}

const withAuth = <P extends IInjectedProps>(Component: React.ComponentType<P>) => {
    return (props: Pick<P, Exclude<keyof P, keyof IInjectedProps>>) => {
        const isAuth = useSelector((state: IRootReducer) => !!state.auth.id && !!state.auth.username);

        return <Component {...props as P} isAuth={isAuth} />
    }
};

export default withAuth;


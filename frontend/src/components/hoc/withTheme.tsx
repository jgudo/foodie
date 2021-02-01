import { useSelector } from "react-redux";
import { IRootReducer } from "~/types/types";

interface IInjectedProps {
    theme: string;
    [prop: string]: any;
}

const withTheme = <P extends IInjectedProps>(Component: React.ComponentType<P>) => {
    return (props: Pick<P, Exclude<keyof P, keyof IInjectedProps>>) => {
        const theme = useSelector((state: IRootReducer) => state.settings.theme);

        return <Component {...props as P} theme={theme} />
    }
};

export default withTheme;


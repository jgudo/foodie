import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkSession } from "~/redux/action/authActions";

const Home: React.FC = () => {


    return (
        <div className="container pt-16">
            <h1 className="text-xl2">
                Welcome to Foodie
            </h1>
        </div>
    );
};

export default Home;

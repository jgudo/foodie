import { Link } from "react-router-dom"

const NavBar: React.FC = () => {
    return (
        <nav className="flex justify-between align-center w-100 bg-white text-gray-700 h-60px py-2 px-20">
            <ul className="flex items-center">
                <li className="logo">
                    <h2 className="text-2xl">Foodie</h2>
                </li>
            </ul>
            <ul className="flex items-center">
                <li className="inline-block mx-3">
                    <Link to="/login">Login</Link>
                </li>
                <li className="inline-block mx-3">
                    <Link to="/register">Create Accont</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;

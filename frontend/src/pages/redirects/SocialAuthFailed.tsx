import { Link } from "react-router-dom";
import { useDocumentTitle } from "~/hooks";

const SocialAuthFailed = () => {
    useDocumentTitle('Authentication Failed');

    return (
        <div className="contain pt-14 h-full">
            <h1 className="mt-8 text-2xl laptop:text-4xl dark:text-white">Failed to authenticate</h1>
            <br />
            <h4 className="text-gray-600 dark:text-gray-400">Possible cause(s):</h4>
            <ul className="text-gray-500">
                <li className="list-disc ml-8">Same email/username has been already linked to other social login eg: Google</li>
            </ul>

            <Link className="button inline-flex mt-8" to="/">Back to Login</Link>
        </div>
    );
};

export default SocialAuthFailed;

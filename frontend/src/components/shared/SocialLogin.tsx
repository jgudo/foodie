import { FacebookFilled, GithubFilled } from "@ant-design/icons";

const SocialLogin: React.FC<{ isLoading: boolean; }> = ({ isLoading }) => {
    const onClickSocialLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (isLoading) e.preventDefault();
    }

    return (
        <>
            <a
                className="button w-full bg-blue-500 hover:bg-blue-600 laptop:w-2/4"
                href={`${process.env.REACT_APP_FOODIE_URL}/api/v1/auth/facebook`}
                onClick={onClickSocialLogin}
            >
                <FacebookFilled className="flex items-center justify-center absolute left-4 laptop:left-8 top-0 bottom-0 my-auto" />
                Facebook
            </a>
            <a
                className="button w-full border border-gray-300 bg-gray-700 hover:bg-gray-600 laptop:w-2/4"
                href={`${process.env.REACT_APP_FOODIE_URL}/api/v1/auth/github`}
                onClick={onClickSocialLogin}
            >
                <GithubFilled className="flex items-center justify-center absolute left-4 laptop:left-8 top-0 bottom-0 my-auto" />
                GitHub
            </a>
        </>
    )
};

export default SocialLogin;

import ContentLoader from 'react-content-loader';
import withTheme from '../hoc/withTheme';

interface IUserLoader {
    includeButton?: boolean;
    backgroundColor?: string;
    foregroundColor?: string;
}

const loaderBgLight = "#e2e2e2";
const loaderFgLight = "#ecebeb";
const loaderBgDark = "#181621";
const loaderFgDark = "#25232f";

export const PostLoader: React.FC<any> = withTheme((props) => {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height="100%"
            viewBox="0 0 500 400"
            backgroundColor={props.theme === 'dark' ? loaderBgDark : loaderBgLight}
            foregroundColor={props.theme === 'dark' ? loaderFgDark : loaderFgLight}
            {...props}
        >
            <circle cx="20" cy="20" r="20" />
            <rect x="48" y="8" rx="3" ry="3" width="100" height="10" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="10" />
            <rect x="0" y="60" rx="3" ry="3" width="80%" height="10" />
            <rect x="0" y="78" rx="3" ry="3" width="56%" height="10" />
            <rect x="0" y="98" rx="3" ry="3" width="65%" height="10" />
            <rect x="0" y="132" rx="3" ry="3" width="100%" height="420" />
        </ContentLoader>
    )
})

export const UserLoader: React.FC<IUserLoader> = withTheme((props) => (
    <ContentLoader
        speed={2}
        width="100%"
        height="55"
        // viewBox="0 0 400 80"
        backgroundColor={props.theme === 'dark' ? loaderBgDark : loaderBgLight}
        foregroundColor={props.theme === 'dark' ? loaderFgDark : loaderFgLight}
    >
        <circle cx="30" cy="30" r="20" />
        <rect x="60" y="25" rx="5" ry="5" width="30%" height="10" />
        {props.includeButton && <rect x="70%" y="10" rx="20" ry="20" width="100" height="40" />}
    </ContentLoader>
));

UserLoader.defaultProps = { includeButton: false };

export const ProfileLoader: React.FC = withTheme(({ theme }) => {
    const bg = theme === 'dark' ? loaderBgDark : loaderBgLight;
    const fg = theme === 'dark' ? loaderFgDark : loaderFgLight;

    return (
        <div>
            {/*  ----- COVER PHOTO ------- */}
            <div className="w-full h-60 laptop:mb-0 laptop:h-80 bg-gray-200 dark:bg-indigo-1000 relative overflow-hidden" />
            <div className="contain w-full relative flex transform laptop:-translate-y-28">
                {/* --- PROFILE PICTURE */}
                <div className="absolute left-0 right-0 mx-auto transform -translate-y-32 laptop:transform-none laptop:relative laptop:w-1/3 h-60 mr-2 flex justify-center">
                    <div className="w-40 h-40 laptop:w-60 laptop:h-60 rounded-full border-4 border-white dark:border-indigo-1000 overflow-hidden">
                        <ContentLoader
                            speed={2}
                            width="100%"
                            height="100%"
                            viewBox="0 0 500 500"
                            backgroundColor={bg}
                            foregroundColor={fg}
                        >
                            <circle cx="250" cy="250" r="250" />
                        </ContentLoader>
                    </div>
                </div>
                {window.screen.width >= 800 && (
                    <div className="flex w-full  flex-col self-end transform -translate-y-4 laptop:transform-none">
                        <div className="w-full  flex flex-col laptop:flex-row justify-center laptop:justify-between mr-14 ml-2 mb-2">
                            {/* ---- NAME AND USERNAME */}
                            <div>
                                <ContentLoader
                                    speed={2}
                                    width="100%"
                                    height="100%"
                                    backgroundColor={bg}
                                    foregroundColor={fg}
                                >
                                    <rect x="0" y="70" rx="15" ry="15" width="220" height="25" />
                                    <rect x="0" y="110" rx="5" ry="5" width="100" height="15" />
                                </ContentLoader>
                            </div>
                            {/* ---- FOLLOW/UNFOLLOW/MESSAGE BUTTON */}
                            <div>
                                <ContentLoader
                                    speed={2}
                                    width="100%"
                                    height="100%"
                                    backgroundColor={bg}
                                    foregroundColor={fg}
                                >
                                    <rect x="25" y="70" rx="25" ry="25" width="100" height="50" />
                                    <rect x="140" y="70" rx="25" ry="25" width="100" height="50" />
                                </ContentLoader>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
});

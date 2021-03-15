import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import Loader from "~/components/shared/Loader";
import { IFileHandler, IImage } from "~/types/types";

interface IProps {
    coverPhotoOverlayRef: React.RefObject<HTMLDivElement>;
    coverPhoto: IFileHandler<IImage>;
    isUploadingCoverPhoto: boolean;
    isOwnProfile: boolean;
    handleSaveCoverPhoto: () => void;
}

const CoverPhotoOverlay: React.FC<IProps> = (props) => {
    return (
        <div
            className={`w-full h-full laptop:bg-black laptop:bg-opacity-50 absolute flex items-center justify-center laptop:invisible transition-all ${props.coverPhoto.imageFile.file ? 'z-10' : 'z-0'}`}
            ref={props.coverPhotoOverlayRef}
        >
            <input
                type="file"
                hidden
                accept="image/*"
                onChange={props.coverPhoto.onFileChange}
                readOnly={props.isUploadingCoverPhoto}
                id="cover"
            />
            {props.isOwnProfile && (
                <>
                    {props.isUploadingCoverPhoto ? <Loader mode="light" /> : (
                        <>
                            {props.coverPhoto.imageFile.file ? (
                                <div className="flex">
                                    <button className="button--danger !rounded-full" onClick={props.coverPhoto.clearFiles}>
                                        <CloseOutlined className="text-xl text-white" />
                                    </button>
                                            &nbsp;
                                    <label
                                        className="button--muted !rounded-full cursor-pointer"
                                        htmlFor="cover"
                                    >
                                        Change
                                            </label>
                                            &nbsp;
                                    <button onClick={props.handleSaveCoverPhoto}>Save</button>
                                </div>
                            ) : (
                                <label
                                    className="p-3 laptop:p-4 bg-indigo-700 absolute right-4 top-4  laptop:relative text-white font-medium rounded-full cursor-pointer hover:bg-indigo-800"
                                    htmlFor="cover"
                                >
                                    {window.screen.width > 800 ? 'Change Cover Photo' : (
                                        <CameraOutlined className="text-xl text-white" />
                                    )}
                                </label>

                            )}
                        </>
                    )}
                </>
            )}

        </div>
    );
};

export default CoverPhotoOverlay;

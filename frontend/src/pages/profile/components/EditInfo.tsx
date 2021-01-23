import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import useDocumentTitle from '~/hooks/useDocumentTitle';
import { updateProfileInfo } from '~/redux/action/profileActions';
import { updateUser } from '~/services/api';
import { IProfile } from "~/types/types";

interface IProps {
    isOwnProfile: boolean;
    profile: IProfile;
}

const EditInfo: React.FC<IProps> = ({ isOwnProfile, profile }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [field, setField] = useState({
        firstname: profile?.firstname || '',
        lastname: profile?.lastname || '',
        gender: profile?.info.gender || '',
        bio: profile?.info.bio || '',
        birthday: profile?.info?.birthday || ''
    });
    const history = useHistory();
    const dispatch = useDispatch();
    let isMountedRef = useRef<boolean | null>(null);

    useDocumentTitle(`Edit Info - ${profile.username} | Foodie`);
    useEffect(() => {
        if (isMountedRef) isMountedRef.current = true;

        return () => {
            if (isMountedRef) isMountedRef.current = false;
        }
    }, []);

    useEffect(() => {
        setField({
            firstname: profile.firstname,
            lastname: profile.lastname,
            gender: profile.info.gender,
            bio: profile.info.bio,
            birthday: profile.info.birthday
        });
    }, [profile]);

    const handleUpdateUser = async () => {
        try {
            setIsUpdating(true);
            const user = await updateUser(profile.username, field);

            dispatch(updateProfileInfo(user));

            if (isMountedRef.current) {
                console.log(user);
                setIsUpdating(false);

                history.push(`/user/${profile.username}/info`);
                toast.dark('Profile updated successfully.')
            }
        } catch (e) {
            if (isMountedRef.current) {
                setIsUpdating(false);
            }

            toast.dismiss();
            toast.error(e.error.message || 'Unable to process your request.');
        }
    };

    const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField({ ...field, firstname: e.target.value });
    }

    const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField({ ...field, lastname: e.target.value });
    }

    const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setField({ ...field, gender: e.target.value });
    }

    const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setField({ ...field, birthday: e.target.value });
    }

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setField({ ...field, bio: e.target.value });
    }

    const handleBack = () => {
        history.push(`/user/${profile.username}/info`)
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleUpdateUser();
    }

    return (!isOwnProfile && profile.username) ? <Redirect to={`/${profile.username}`} /> : (
        <div className="p-4 bg-white rounded-md min-h-10rem shadow-lg">
            <h3 className="text-gray-500">Edit Info</h3>
            <form className="mt-8 space-y-4 divide-y divide-gray-100" onSubmit={handleSubmit}>
                {/* ---- FIRST NAME ------- */}
                <div className="flex flex-col py-2">
                    <label htmlFor="firstname" className="ml-4 text-gray-400 mb-2">First Name</label>
                    <input
                        readOnly={isUpdating}
                        id="firstname"
                        type="text"
                        maxLength={50}
                        onChange={handleFirstnameChange}
                        value={field.firstname}
                    />
                </div>
                {/* ---- LAST NAME ------- */}
                <div className="flex flex-col py-2">
                    <label htmlFor="lastname" className="ml-4 text-gray-400 mb-2">Last Name</label>
                    <input
                        readOnly={isUpdating}
                        id="lastname"
                        type="text"
                        maxLength={50}
                        onChange={handleLastnameChange}
                        value={field.lastname}
                    />
                </div>
                {/* ---- GENDER && BIRTHDAY ------- */}
                <div className="grid grid-cols-2">
                    <div className="flex flex-col py-2">
                        <label htmlFor="gender" className="ml-4 text-gray-400 mb-2">Gender</label>
                        <select
                            id="gender"
                            onChange={handleGenderChange}
                            disabled={isUpdating}
                            value={field.gender === null ? '' : field.gender}
                        >
                            <option disabled value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unspecified">Better Not Say</option>
                        </select>
                    </div>
                    <div className="flex flex-col py-2">
                        <label htmlFor="birthday" className="ml-4 text-gray-400 mb-2">Birthday (mm/dd/yyyy)</label>
                        <input
                            readOnly={isUpdating}
                            type="date"
                            value={field.birthday ? new Date(field.birthday).toISOString().split('T')[0] : ''}
                            onChange={handleBirthdayChange}
                        />
                    </div>
                </div>
                {/* ---- BIO ------- */}
                <div className="flex flex-col py-2">
                    <label htmlFor="bio" className="ml-4 text-gray-400 mb-2">Bio</label>
                    <textarea
                        placeholder="Tell something about yourself"
                        id="bio"
                        cols={10}
                        rows={4}
                        readOnly={isUpdating}
                        onChange={handleBioChange}
                        maxLength={300}
                        value={field.bio}
                    />
                </div>
                {/* ---- SUBMIT BUTTON ----- */}
                <div className="flex justify-between pt-8">
                    <button
                        disabled={isUpdating}
                        type="button"
                        onClick={handleBack}
                        className="button--muted !rounded-full"
                    >
                        <ArrowLeftOutlined className="text-xl flex items-center justify-center mr-4" />
                        Back to Info
                    </button>
                    <button
                        className="flex items-center"
                        type="submit"
                        disabled={isUpdating}
                    >
                        <SaveOutlined className="text-xl flex items-center justify-center mr-4" />
                        {isUpdating ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditInfo;

import { useState } from 'react';
import { toast } from 'react-toastify';
import { IFileHandler, IImage } from '~/types/types';

const useFileHandler = <T extends unknown>(type = "multiple", initState: T): IFileHandler<T> => {
    const [imageFile, setImageFile] = useState<T>(initState);
    const [isFileLoading, setFileLoading] = useState(false);

    const removeImage = (id: string) => {
        if (!Array.isArray(imageFile)) return;

        const items = imageFile.filter(item => item.id !== id);

        setImageFile(items as T);
    };

    const clearFiles = () => {
        setImageFile(initState as T);
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>, callback?: (file?: IImage) => void) => {
        if (!event.target.files) return;
        if ((event.target.files.length + (imageFile as IImage[]).length) > 5) {
            return toast.error('Maximum of 5 photos per post allowed.', { hideProgressBar: true });
        }

        // TODO ===  FILTER OUT DUPLICATE IMAGES

        const val = event.target.value;
        const img = event.target.files[0] as File;

        if (!img) return;

        const size = img.size / 1024 / 1024;
        const regex = /(\.jpg|\.jpeg|\.png)$/i;

        setFileLoading(true);
        if (!regex.exec(val)) {
            toast.error('File type must be JPEG or PNG', { hideProgressBar: true });
            setFileLoading(false);
        } else if (size > 2) {
            toast.error('File size exceeded 2mb', { hideProgressBar: true });
            setFileLoading(false);
        } else if (type === 'single') {
            const file = event.target.files[0] as File;
            const url = URL.createObjectURL(file);
            setImageFile({
                file,
                url,
                id: file.name
            } as T);
            if (callback) callback(imageFile as IImage);
        } else {
            Array.from(event.target.files).forEach((file) => {
                const url = URL.createObjectURL(file);
                setImageFile((oldFiles) => ([...oldFiles as any, {
                    file,
                    url,
                    id: file.name
                }] as T));
            });
            if (callback) callback(imageFile as IImage);
            setFileLoading(false);
        }
    };

    return {
        imageFile,
        setImageFile,
        isFileLoading,
        onFileChange,
        removeImage,
        clearFiles
    };
};

export default useFileHandler;
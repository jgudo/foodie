import { useState } from 'react';
import { toast } from 'react-toastify';

interface IImage {
    id: string;
    url: string | ArrayBuffer;
    file: File;
}

const useFileHandler = () => {
    const [imageFile, setImageFile] = useState<IImage[]>([]);
    const [isFileLoading, setFileLoading] = useState(false);

    const removeImage = (id: string) => {
        const items = imageFile.filter(item => item.id !== id);

        setImageFile(items);
    };

    const clearFiles = () => {
        setImageFile([]);
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        if ((event.target.files.length + imageFile.length) > 5) {
            return toast.error('Maximum of 5 photos per post allowed.', { hideProgressBar: true });
        }

        // TODO ===  FILTER OUT DUPLICATE IMAGES

        const val = event.target.value;
        const img = event.target.files[0];
        const size = img.size / 1024 / 1024;
        const regex = /(\.jpg|\.jpeg|\.png)$/i;

        setFileLoading(true);
        if (!regex.exec(val)) {
            toast.error('File type must be JPEG or PNG', { hideProgressBar: true });
            setFileLoading(false);
        } else if (size > 2) {
            toast.error('File size exceeded 2mb', { hideProgressBar: true });
            setFileLoading(false);
        } else {
            Array.from(event.target.files).forEach((file) => {
                const reader = new FileReader();
                reader.addEventListener('load', (e) => {
                    setImageFile(oldFiles => [...oldFiles, {
                        file,
                        url: e.target?.result || '',
                        id: file.name
                    }]);
                });
                reader.readAsDataURL(file);
            });

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
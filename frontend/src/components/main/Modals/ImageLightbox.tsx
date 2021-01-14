import { useEffect, useState } from "react";
import Lightbox from 'react-image-lightbox';

interface IProps {
    images: string[];
    isOpen: boolean;
    activeIndex: number;
    closeLightbox: () => void;
}

const ImageLightbox: React.FC<IProps> = (props): React.ReactElement | null => {
    const { images, isOpen, closeLightbox, activeIndex } = props;
    const [imgIndex, setImgIndex] = useState(activeIndex);

    useEffect(() => {
        setImgIndex(activeIndex);
    }, [activeIndex]);

    const onNext = () => {
        setImgIndex((imgIndex + 1) % images.length);
    }

    const onPrev = () => {
        setImgIndex((imgIndex + images.length - 1) % images.length);
    }

    return isOpen ? (
        <div className="relative">
            <Lightbox
                mainSrc={images[imgIndex]}
                nextSrc={images[(imgIndex + 1) % images.length]}
                prevSrc={images[(imgIndex + images.length - 1) % images.length]}
                onCloseRequest={closeLightbox}
                onMovePrevRequest={onPrev}
                onMoveNextRequest={onNext}
                enableZoom={false}
                wrapperClassName="lightbox-wrapper"
                reactModalStyle={{
                    content: {
                        zIndex: 9999,
                        top: '60px'
                    }
                }}
            />
        </div>
    ) : null;
};

export default ImageLightbox;

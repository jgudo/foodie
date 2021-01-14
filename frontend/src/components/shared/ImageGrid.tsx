interface IProps {
    images: string[];
}

const ImageGrid: React.FC<IProps> = ({ images }) => {
    const renderGrid = () => {
        switch (images.length) {
            case 1:
                return `
                    <div class="grid">
                        <img src=${images[0]} class="grid-img"/>
                    </div>
                `
            case 2:
                return `
                    <div class="grid grid-rows-2">
                        <img src=${images[0]} class="grid-img" />
                        <img src=${images[1]} class="grid-img" />
                    </div>
                `
            case 3:
                return `
                    <div class="grid grid-rows-2">
                        <div class="grid">
                            <img src=${images[0]} class="grid-img" />
                        </div>
                        <div class="grid grid-cols-2">
                            <img src=${images[1]} class="grid-img" />
                            <img src=${images[2]} class="grid-img" />
                        </div>
                    </div>
                `
            case 4:
                return `
                    <div class="grid grid-rows-2">
                        <div class="grid grid-cols-2">
                            <img src=${images[0]} class="grid-img" />
                            <img src=${images[1]} class="grid-img" />
                        </div>
                        <div class="grid grid-cols-2">
                            <img src=${images[2]} class="grid-img" />
                            <img src=${images[3]} class="grid-img" />
                        </div>
                    </div>
                `
            case 5:
                return `
                    <div class="grid grid-rows-2">
                        <div class="grid grid-cols-2">
                            <img src=${images[0]} class="grid-img" />
                            <img src=${images[1]} class="grid-img" />
                        </div>
                        <div class="grid grid-cols-3">
                            <img src=${images[2]} class="grid-img" />
                            <img src=${images[3]} class="grid-img" />
                            <img src=${images[4]} class="grid-img" />
                        </div>
                    </div>
                `
            default:
                return `
                    <div class="grid-items grid-items-2">
                        <img src=${images[0]} class="grid-img"/>
                    </div>
                `
        }
    }
    return (
        <div
            className="w-full h-25rem"
            dangerouslySetInnerHTML={{ __html: renderGrid() }}
        >
        </div>
    )
};

export default ImageGrid;

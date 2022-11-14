import React from "react";
import { Image, } from "antd";

interface Props {
    src: any;
    alt?: any;
    className?: string;
    style?: any;
}

const ImageDom: React.FC<Props> = (props: any) => {
    return <Image {...props} />
};

export default ImageDom;
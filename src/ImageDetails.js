import { forwardRef } from "react";

const Details = ({ imageData }, ref) => {
    return (
      <li key={imageData.id} ref={ref}>
        <div>Album id:{imageData.albumId}</div>
        <div>Title: {imageData.title}</div>
        <div>Url:{imageData.url}</div>
        <img alt="" loading="lazy" src={imageData.thumbnailUrl} />
      </li>
    );
  };
  export default forwardRef(Details);
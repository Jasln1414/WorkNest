import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { IoCloseCircleOutline } from "react-icons/io5";
import setCanvasPreview from './setCanvasPreview';
import '../../Styles/ProfilePic.css'

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

function ProfilepicModal({ setCroppedImageUrl, setImgError, setImageUrl, imageUrl, closeModal }) {
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const onImageLoad = (e) => {
    setImgError('');
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
      setImgError("Image must be at least 150 x 150 pixels");
      setImageUrl('');
      return;
    }
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCrop = () => {
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
    setCroppedImageUrl(dataUrl);
    closeModal();
  };

  return (
    <div className="profilepic-modal-overlay" aria-labelledby="crop-image-dialog" role="dialog" aria-modal="true">
      <div className="profilepic-modal-backdrop"></div>
      <div className="profilepic-modal-container">
        <div className="profilepic-modal-content">
          <div className="profilepic-modal-header">
            <button
              type="button"
              className="profilepic-modal-close-button"
              onClick={closeModal}
            >
              <IoCloseCircleOutline />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          {imageUrl && (
            <div className="profilepic-modal-body">
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                circularCrop
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Upload"
                  className="profilepic-modal-image"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
              <button
                onClick={handleCrop}
                className="profilepic-modal-crop-button"
              >
                Crop Image
              </button>
            </div>
          )}
          {crop && (
            <canvas
              ref={previewCanvasRef}
              className="profilepic-modal-canvas"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilepicModal;
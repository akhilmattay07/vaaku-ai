import { useState, useRef, useCallback } from "react"
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

function centerAspectCrop(mediaWidth, mediaHeight) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 60 }, 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  )
}

async function getCroppedBlob(image, crop) {
  const canvas  = document.createElement("canvas")
  const scaleX  = image.naturalWidth  / image.width
  const scaleY  = image.naturalHeight / image.height
  const size    = 300
  canvas.width  = size
  canvas.height = size

  const ctx = canvas.getContext("2d")
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.clip()

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width  * scaleX,
    crop.height * scaleY,
    0, 0, size, size
  )

  return new Promise(resolve => {
    canvas.toBlob(resolve, "image/jpeg", 0.95)
  })
}

export default function ImageCropper({ onCropDone, onCancel }) {
  const [imgSrc,     setImgSrc]     = useState("")
  const [crop,       setCrop]       = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const imgRef = useRef(null)

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result)
    reader.readAsDataURL(file)
  }

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }, [])

  const handleDone = async () => {
    if (!completedCrop || !imgRef.current) return
    const blob = await getCroppedBlob(imgRef.current, completedCrop)
    onCropDone(blob)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-4 border border-gray-700">

        <h3 className="text-lg font-bold text-orange-400 text-center">
          Choose your profile picture
        </h3>

        {!imgSrc && (
          <div
            onClick={() => document.getElementById("crop-file-input").click()}
            className="border-2 border-dashed border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-orange-500 transition">
            <p className="text-4xl mb-2">📷</p>
            <p className="text-gray-400">Click to select an image</p>
            <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP supported</p>
          </div>
        )}

        <input
          id="crop-file-input"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />

        {imgSrc && (
          <>
            <p className="text-gray-400 text-sm text-center">
              Drag the circle to select which part to use
            </p>

            <div className="flex justify-center max-h-80 overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                onComplete={c => setCompletedCrop(c)}
                aspect={1}
                circularCrop
                minWidth={50}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  onLoad={onImageLoad}
                  alt="crop preview"
                  style={{ maxHeight: "320px", maxWidth: "100%" }}
                />
              </ReactCrop>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-4 bg-gray-700 rounded-xl p-3">
              <p className="text-xs text-gray-400">Preview:</p>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400 flex-shrink-0">
                {completedCrop && imgRef.current && (
                  <CropPreview
                    image={imgRef.current}
                    crop={completedCrop}
                  />
                )}
              </div>
              <p className="text-xs text-gray-400">This is how it will look in the navbar</p>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold text-sm">
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!completedCrop}
            className="flex-1 bg-orange-500 hover:bg-orange-400 py-3 rounded-xl font-semibold text-sm disabled:opacity-50">
            Use this photo
          </button>
        </div>

      </div>
    </div>
  )
}

// Small live preview component
function CropPreview({ image, crop }) {
  const canvasRef = useRef(null)

  useCallback(() => {
    if (!canvasRef.current || !crop) return
    const canvas = canvasRef.current
    const scaleX  = image.naturalWidth  / image.width
    const scaleY  = image.naturalHeight / image.height
    const size    = 48
    canvas.width  = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(
      image,
      crop.x * scaleX, crop.y * scaleY,
      crop.width * scaleX, crop.height * scaleY,
      0, 0, size, size
    )
  }, [image, crop])()

  return <canvas ref={canvasRef} className="w-full h-full" />
}
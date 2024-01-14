
type Props = {
    url: string,
    index: number,
    handleRemoveImage: (i: number) => void
}

const ImageDisplay = ({ url, index, handleRemoveImage }: Props) => {
  return (
    <div className="flex justify-between items-center p-3 border">
        <img 
            src={url} 
            alt="listing" 
            className="w-20 h-20 object-contain rounded-lg"
        />
        <button type="button" onClick={() => handleRemoveImage(index)} className="text-red-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Delete
        </button>
    </div>
  )
}

export default ImageDisplay
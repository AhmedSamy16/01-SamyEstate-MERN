import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import app from "../utils/firebase"
import ImageDisplay from "../components/ImageDisplay"
import { BASE_URL } from "../utils/constants"
import { useNavigate, useParams } from "react-router-dom"


const UpdateListing = () => {
    const [files, setFiles] = useState<FileList | null>(null)
    const [formData, setFormData] = useState<Partial<IListing>>({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 1,
        discountPrice: 1,
        offer: false,
        parking: false,
        furnished: false
    })
    const [imageUploadError, setImageUploadError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()
    const listingId = params.listingId

    useEffect(() => {
        const getListing = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/v1/listing/${listingId}`)
                const data = await res.json()
                setFormData(data)
            } catch (error) {
                console.log(error)
            }
        }
        getListing()
    }, [listingId])
    
    const uploadImages = () => {
        if (files && files.length >= 1 && files.length < 7) {
            setIsUploading(true)
            setImageUploadError(null)
            let promises: Promise<string>[] = []
            for (const f of files) {
                promises.push(storeImage(f))
            }
            Promise.all(promises)
                .then(urls => {
                    setFormData(prev => ({ ...prev, imageUrls: (formData.imageUrls as string[]).concat(urls) }));
                    setImageUploadError(null)
                })
                .catch(err => {
                    setImageUploadError(err.message);
                })
                .finally(() => {
                    setIsUploading(false)
                })
        } else {
            setImageUploadError("You should upload maximum 6 images per listing");
            setIsUploading(false)
        }
    }

    const storeImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                () => {},
                (err) => {
                    reject(err)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then(url => {
                            resolve(url);
                        })
                }
            )
        })
    }

    const handleDeleteImage = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
        }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (["sale", "rent"].includes(e.target.id)) {
            setFormData(prev => ({
                ...prev,
                type: e.target.id
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [e.target.id]: e.target.value
            }))
        }
    }

    const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.checked
        }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (Number(formData.imageUrls?.length) < 1) {
            setError("You must upload at least one image")
            return
        }
        if (Number(formData.regularPrice) < Number(formData.discountPrice)) {
            setError("Discount Price must be lower than regular Price")
            return
        }

        setLoading(true)
        try {
            setError(null)
            const res = await fetch(`${BASE_URL}/api/v1/listing/${listingId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError((error as any).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">
                Update a Listing
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input 
                        type="text" 
                        placeholder="Name"
                        className="border p-3 rounded-lg"
                        id="name"
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea 
                        placeholder="Description"
                        className="border p-3 rounded-lg resize-none"
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input 
                        type="text" 
                        placeholder="Address"
                        className="border p-3 rounded-lg"
                        id="address"
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    <div className="flex flex-wrap gap-6">
                        <div className="flex gap-2">
                            <input 
                                onChange={handleChange} 
                                type="checkbox" 
                                id="sale" 
                                className="w-5" 
                                checked={formData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                onChange={handleChange} 
                                type="checkbox" 
                                id="rent" 
                                className="w-5" 
                                checked={formData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                onChange={handleCheckBox} 
                                type="checkbox" 
                                id="parking" 
                                className="w-5" 
                                checked={formData.parking}
                            />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                onChange={handleCheckBox} 
                                type="checkbox" 
                                id="furnished" 
                                className="w-5" 
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                onChange={handleCheckBox} 
                                type="checkbox" 
                                id="offer" 
                                className="w-5" 
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="bedrooms" 
                                min={1} 
                                max={10} 
                                required
                                onChange={handleChange}
                                value={formData.bedrooms}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                id="bathrooms" 
                                min={1} 
                                max={10} 
                                required
                                onChange={handleChange}
                                value={formData.bathrooms}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <p>Baths</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center flex-wrap gap-2">
                            <input 
                                type="number" 
                                id="regularPrice"
                                min={1}
                                required
                                onChange={handleChange}
                                value={formData.regularPrice}
                                className="p-3 border border-gray-300 rounded-lg"
                            />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                {formData.type === "rent" && <span className="text-xs">($ / month)</span>}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className="flex items-center flex-wrap gap-2">
                                <input 
                                    type="number" 
                                    id="discountPrice"
                                    min={1}
                                    required
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                    className="p-3 border border-gray-300 rounded-lg"
                                />
                                <div className="flex flex-col items-center">
                                    <p>Discount Price</p>
                                    {formData.type === "rent" && <span className="text-xs">($ / month)</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">The First Image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input 
                            type="file"
                            onChange={e => setFiles(e.target.files)}
                            id="images"
                            accept="image/*"
                            multiple
                            className="p-3 border border-gray-300 rounded w-full"
                        />
                        <button disabled={isUploading} type="button" onClick={uploadImages} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg hover:opacity-80">
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}
                    {
                        formData.imageUrls && formData.imageUrls.length > 0 && formData.imageUrls.map((image, i) => (
                            <ImageDisplay 
                                key={image} 
                                url={image} 
                                handleRemoveImage={handleDeleteImage} 
                                index={i}
                            />
                        ))
                    }
                    <button disabled={loading || isUploading} className="p-3 mb-6 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
                        {loading || isUploading ? "Loading..." : "Update Listing"}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    )
}

export default UpdateListing
import { Link } from "react-router-dom"

type Props = {
    listing: IListing,
    deleteListing: (id: string) => void
}

const UserProfileListing = ({ listing, deleteListing }: Props) => {
    return (
        <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
            <Link to={`/listing/${listing._id}`}>
                <img 
                    src={listing.imageUrls[0]} 
                    alt={listing.name} 
                    className="h-16 w-16 object-contain rounded-lg"
                />
            </Link>
            <Link className="text-slate-700 font-semibold  flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
                <p >{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
                <button className="text-red-700 uppercase" onClick={() => deleteListing(listing._id)}>
                    Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">
                        Edit
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default UserProfileListing
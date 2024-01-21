import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
// import "swiper/swiper-bundle.css"
import "swiper/css/bundle"
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from "react-icons/fa"
import { useAppSelector } from "../redux/hooks"
import { selectUser } from "../redux/slices/user.slice"
import ContactLandlord from "../components/ContactLandlord"

const ListingDisplay = () => {
    const { user } = useAppSelector(selectUser)
    SwiperCore.use([Navigation])
    const params = useParams()
    const listingId = params.listingId
    const [lisitng, setListing] = useState<IListing | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [contactLandlord, setContactLandlord] = useState(false)

    useEffect(() => {
        const getListing = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/v1/listing/${listingId}`)
                const data = await res.json()
                if (data.status === "failed") {
                    setError(data.message)
                } else {
                    setListing(data)
                    setError(null)
                }
            } catch (error) {
                setError((error as any).message)
            } finally {
                setLoading(false)
            }
        }
        getListing()
    }, [listingId])

    if (loading) {
        return <p>Loading...</p>
    }

    if (!lisitng || error) {
        return <p>{error || "Listing Not found"}</p>
    }

    return (
        <main>
            <div>
                <Swiper navigation>
                    {lisitng && lisitng.imageUrls.map(url => (
                        <SwiperSlide key={url} >
                            <div className="h-[550px]" style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: "cover"
                            }}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="fixed top-[13%] right-[3%] z-10 rounded-full w-12 h-12 bg-slate-100 cursor-pointer flex justify-center items-center">
                    <FaShare
                        className="text-slate-500"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            setCopied(true)
                            setTimeout(() => {
                                setCopied(false)
                            }, 2000)
                        }}
                    />
                </div>
                {
                    copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                            Link Copied
                        </p>
                    )
                }
                <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                    <p className="text-2xl font-semibold">
                        {lisitng.name} - ${" "}
                        {
                            lisitng.offer ? lisitng.discountPrice.toLocaleString("en-US") : lisitng.regularPrice.toLocaleString("en-US")
                        }
                        {lisitng.type === "rent" && " / month"}
                    </p>
                    <p className="flex items-center mt-6 gap-2 text-slate-600 my-2 text-sm">
                        <FaMapMarkerAlt className="text-green-700" />
                        {lisitng.address}
                    </p>
                    <div className="flex gap-2">
                        <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                            For {" "} {lisitng.type[0].toUpperCase() + lisitng.type.slice(1)}
                        </p>
                        {
                            lisitng.offer && (
                                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                                    ${lisitng.regularPrice - lisitng.discountPrice} OFF
                                </p>
                            )
                        }
                    </div>
                    <p className="text-slate-800">
                        <strong>Description - </strong>
                        {lisitng.description}
                    </p>
                    <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaBed className="text-lg" />
                            {lisitng.bedrooms} bed{lisitng.bedrooms > 1 && "s"}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaBath className="text-lg" />
                            {lisitng.bathrooms} bath{lisitng.bathrooms > 1 && "s"}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaParking className="text-lg" />
                            {lisitng.parking ? "Parking spot" : "No Parking"}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap">
                            <FaChair className="text-lg" />
                            {lisitng.furnished ? "Furnished" : "Not Furnished"}
                        </li>
                    </ul>
                    {!contactLandlord && user && lisitng.userRef !== user._id && (
                        <button onClick={() => setContactLandlord(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">
                            Contact Landlord
                        </button>
                    )}
                    {contactLandlord && <ContactLandlord listingName={lisitng.name} landlordId={lisitng.userRef} />}
                </div>
            </div>
        </main>
    )
}

export default ListingDisplay
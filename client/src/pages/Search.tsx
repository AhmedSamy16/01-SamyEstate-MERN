import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import ListingCard from "../components/ListingCard"


const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc"
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState<IListing[]>([])
    const [showMore, setShowMore] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === "searchTerm") {
            setSidebarData(prev => ({ ...prev, searchTerm: e.target.value }))
        } else if (["all", "rent", "sale"].includes(e.target.id)) {
            setSidebarData(prev => ({ ...prev, type: e.target.id }))
        } else if (["parking", "furnished", "offer"].includes(e.target.id)) {
            setSidebarData(prev => ({ ...prev, [e.target.id]: e.target.checked }))
        }
    }
    
    const handleSelectOptions = (e: ChangeEvent<HTMLSelectElement>) => {
        const [sort, order] = e.target.value.split("_")
        setSidebarData(prev => ({ ...prev, sort, order }))
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        Object.entries(sidebarData).forEach(([key, value]) => {
            urlParams.set(key, value.toString())
        })
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const showMoreListings = async () => {
        const skip = listings.length
        const urlParams = new URLSearchParams(location.search)
        urlParams.set("skip", skip.toString())
        const searchQuery = urlParams.toString()
        try {
            const res = await fetch(`${BASE_URL}/api/v1/listing?${searchQuery}`)
            const data = await res.json()
            if (data.length < 6) {
                setShowMore(false)
            }
            setListings(prev => prev.concat(data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        const typeFromUrl = urlParams.get("type")
        const parkingFromUrl = urlParams.get("parking")
        const furnishedFromUrl = urlParams.get("furnished")
        const offerFromUrl = urlParams.get("offer")
        const sortFromUrl = urlParams.get("sort")
        const orderFromUrl = urlParams.get("order")
        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || "",
                furnished: furnishedFromUrl === "true",
                parking: parkingFromUrl === "true",
                offer: offerFromUrl === "true",
                order: orderFromUrl || "desc",
                sort: sortFromUrl || "createdAt",
                type: typeFromUrl || "all"
            })
        }

        const searchListings = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            try {
                const res = await fetch(`${BASE_URL}/api/v1/listing?${searchQuery}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json()
                if (data.length >= 6) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
                setListings(data)
            } catch (error) {
                
            } finally {
                setLoading(false)
            }
        }
        searchListings()
    }, [location.search])

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term:
                        </label>
                        <input 
                            type="text"
                            id="searchTerm" 
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="all"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "all"}
                            />
                            <span>Rent & Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "rent"} 
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <label className="font-semibold">Amenities:</label>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="parking"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="checkbox" 
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={sidebarData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="">
                            Sort:
                        </label>
                        <select 
                            id="sort_order" 
                            className="border rounded-lg p-3"
                            defaultValue="createdAt_desc"
                            onChange={handleSelectOptions}
                        >
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                            <option value="regularPrice_desc">Price High To Low</option>
                            <option value="regularPrice_asc">Price Low To High</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
                        Search
                    </button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing Results</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className="text-xl text-center text-slate-700">
                            No Listings Found!
                        </p>
                    )}
                    {loading && (
                        <p className="text-xl text-slate-700 text-center w-4">
                            Loading...
                        </p>
                    )}
                    {!loading && listings.length > 0 && listings.map(l => <ListingCard key={l._id} listing={l} />)}
                    {showMore && (
                        <button onClick={showMoreListings} className="text-green-700 hover:underline p-7 w-full text-center">
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
import "swiper/css/bundle"
import ListingCard from "../components/ListingCard"

const Home = () => {
  const [offerListings, setOfferListings] = useState<IListing[]>([])
  const [saleListings, setSaleListings] = useState<IListing[]>([])
  const [rentListings, setRentListings] = useState<IListing[]>([])

  SwiperCore.use([Navigation])

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listing?offer=true&limit=3`)
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listing?type=rent&limit=3`)
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/listing?type=sale&limit=3`)
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListings()
  }, [])

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find Your Next <span className="text-slate-500">Perfect</span> 
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          SamyState is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from
        </div>
        <Link to="/search" className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Let's start now...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {
          offerListings.length > 0 && offerListings.map(l => (
            <SwiperSlide>
              <div 
                className="h-[500px]" 
                style={{ background: `url(${l.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} 
                key={l._id}></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      {/* listing results  */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                <Link to="/search?offer=true" className="text-sm text-blue-800 hover:underline">
                  Show More Offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            </div>
          )
        }
        {
          rentListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Places for Rent</h2>
                <Link to="/search?type=rent" className="text-sm text-blue-800 hover:underline">
                  Show More Places for Rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            </div>
          )
        }
        {
          saleListings.length > 0 && (
            <div>
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent Places for Sale</h2>
                <Link to="/search?type=sale" className="text-sm text-blue-800 hover:underline">
                  Show More Places for Sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home
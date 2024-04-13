import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css/bundle";
import {Navigation} from "swiper/modules"
import SwiperCore from "swiper";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  
  SwiperCore.use([Navigation]);
  useEffect(()=> {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }
    
    const fetchRentListings = async () => {
      try {
        const res = await fetch("https://localhost:5000/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListings()
  }, [])
  return (
    <div>
      {/* Top */}
        <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next
            <span className="text-slate-500">perfect </span>
            <br/>
            place with ease
          </h1>
        </div>
        <div className="mx-auto max-w-6xl px-3 text-gray-400 text-xs sm:text-sm">
          Edge Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="mx-auto width text-sx sm:text-sm text-blue-800 font-bold hover:underline">
          Lets get started
        </Link>

      {/* Swiper */}
      <Swiper navigation>
      {
        offerListings && offerListings.length > 0 && 
        offerListings.map((listing)=> (
          <SwiperSlide>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className="h-[500px]" key={listing._id}></div>
          </SwiperSlide>
        ))
      }
      </Swiper>

      {/* Listing results */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-19">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show more offers</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={"/search?rent=true"}>Show more places for rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for Sale</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show more places on Sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

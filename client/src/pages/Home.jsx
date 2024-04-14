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
        const res = await fetch("https://edge-estate.onrender.com/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }
    
    const fetchRentListings = async () => {
      try {
        const res = await fetch("https://edge-estate.onrender.com/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("https://edge-estate.onrender.com/api/listing/get?type=sale&limit=4");
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
        <div className="flex flex-col gap-6 py-5 px-3 max-w-[100%] items-center lg:py-18">
          <h1 className="text-slate-700 text-center font-bold text-3xl lg:text-6xl">Find your next
            <span className="text-slate-500"> perfect </span>
            <br/>
            place with ease
          </h1>
        </div>
        <div className="flex justify-center max-w-[100%] text-gray-400 text-xs sm:text-sm">
          Edge Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <div className="flex justify-center mt-2">
          <Link
            to={"/search"}
            className="inline-block mb-2 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full text-xs sm:text-sm"
          >
            Let's get started
          </Link>
        </div>

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
      <div className="max-w-[100%] justify-around mx-auto flex flex-col gap-8 my-19">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl text-center font-semibold text-slate-600">Recent offers</h2>
                <div className="flex justify-center">
                  <Link className="text-sm text-blue-800 text-center hover:underline" to={"/search?offer=true"}>Show more offers</Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-around">
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
                <h2 className="text-2xl font-semibold text-center text-slate-600">Recent places for rent</h2>
                <div className="flex justify-center">
                  <Link className="text-sm text-blue-800 hover:underline" to={"/search?rent=true"}>Show more places for rent</Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-around">
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
                <h2 className="text-2xl text-center font-semibold text-slate-600">Recent places for Sale</h2>
                <div className="flex justify-center">
                  <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>
                    Show more places on Sale
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-around">
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

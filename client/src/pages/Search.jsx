import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
export default function Search() {

  const navigate = useNavigate();

  const [sidebarData, setSideBardata] = useState({
    searchTerm: "",
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: 'desc'
  });

  const [loading, setLoading] = useState(false); 
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState([]);

  useEffect(()=> {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if(
      searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl
    ){
      setSideBardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc"
      });
    }

    const fetchListing = async() => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`https://edge-estate.onrender.com/api/listing/get?${searchQuery}`)
      const data = await res.json();
      if(data.length > 8) {
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setListings(data);
      setLoading(false);
    }
    fetchListing()
  }, [location.search])

  const handleChange = (e)=>{
    if(e.target.id === "all" || e.target.id=== "rent" || e.target.id === 'sale'){
      setSideBardata({...sidebarData, type: e.target.id});
    };

    if(e.target.id === "searchTerm") {
      setSideBardata({...sidebarData, searchTerm:e.target.value});
    };

    if(e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === "offer"){
      setSideBardata({...sidebarData, [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false})
    }

    if(e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0];
      const order = e.target.value.split("_")[1];
      setSideBardata({...sidebarData, sort, order})

    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)

  }

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`https://localhost:5000/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data])

  }
  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <div className="p-7 border-b-2 md:border-r-2">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap"></label>
            <input type="text" id="searchTerm" placeholder='Search....' className="border rounded-lg p-3 w-full" value={sidebarData.searchTerm} onChange={handleChange} />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Type:</label>

            <div className='flex gap-2'>
              <input type="checkbox" id="all" className="w-5" checked={sidebarData.type === "all"} onChange={handleChange}/>
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="rent" className="w-5" checked={sidebarData.type === "rent"} onChange={handleChange}/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="sale" className="w-5" checked={sidebarData.type === "sale"} onChange={handleChange}/>
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="offer" className="w-5" checked={sidebarData.offer === true} onChange={handleChange}/>
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label>Amenities</label>

            <div className='flex gap-2'>
              <input type="checkbox" id="parking" className="w-5" checked={sidebarData.parking === true} onChange={handleChange}/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id="furnished" className="w-5" checked={sidebarData.furnished=== true} onChange={handleChange}/>
              <span>Furnished</span>
            </div>
            </div>
            <div className="">
              <label>Sort:</label>
              <select id="sort_order" className='border rounded-lg p-3' onChange={handleChange} defaultValue={"created_at_desc"}>
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>

            <button type="submit" className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
        </form>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {
            loading && (
              <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
            )
          }
          {
            !loading && listings && listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))
          }

          {showMore && (
            <button
              onClick={()=> {
                onShowMoreClick();
              }}
              className="text-green-700 hover:underline p-7 text-center w-full">
                Show More
              </button>
          )}
        </div>
      </div>
    </div>
  )
}

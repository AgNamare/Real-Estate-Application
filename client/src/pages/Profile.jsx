import {useSelector} from "react-redux";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {deleteUserStart, deleteUserSuccess, deleteUserFailure, updateUserStart, updateUserSuccess, updateUserFailure, signOutUserStart } from "../redux/user/userSlice";

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=>state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState({});

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:5000/api/user/update/${currentUser._id}`, {
        method: "POST",
        credentials: "include", 
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }catch(error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:5000/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include", 
      });
      const data = await res.json();
      if(data.success===false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async() =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('http://localhost:5000/api/auth/signout');
      const data = await res.json();
      if(data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserFailure(data.message));
    } catch (error) {
      next(error);
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`http://localhost:5000/api/user/listings/${currentUser._id}`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success == false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
      console.log(userListings);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/listing/delete/${listingId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if(data.success === false) {
        console.log(data.message);
        return;
      } 

      setUserListings ((prev) => prev.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto flex-1">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <img src={currentUser.avatar} alt="profile"  className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"/>
        <input onChange={handleChange}type="text"defaultValue={currentUser.username} placeholder="username" className="border p-3 rounded-lg" id="username" />
        <input onChange={handleChange}type="email"defaultValue={currentUser.email} placeholder="email" className="border p-3 rounded-lg" id="email" />
        <input onChange={handleChange}type="password" placeholder="password" className="border p-3 rounded-lg" id="password" />
        <button type="submit" className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading?"loading...":"Update"}</button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5">{{error} ? error:""}</p>
      <p className="text-green-700 mt-5">{updateSuccess? "User is updated successfully":""}</p>
      <button className="text-green-700 w-full" onClick={handleShowListings}>Show Listings</button>
      {showListingsError && <p className="text-red-700 mt-5">Error showing Listings</p>}

      {userListings && userListings.length > 0 && 
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-3xl semi-bold">Your Listings</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link className="h-16 w-16 object-contain" to={`listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover"/>
            </Link>
            <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col items-center">
              <button className="text-red-700 uppercase" onClick={()=>handleListingDelete(listing._id)}>DELETE</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">EDIT</button>
              </Link>
            </div>
          </div>
        ))}
      </div>}
    </div>
  )
}

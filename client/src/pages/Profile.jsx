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
      dispatch(signOutUserStart);
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
    </div>
  )
}

import { useEffect, useState } from "react";
import {Link} from "react-router-dom";
export default function Contact({listing}) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  }
  useEffect(()=> {
    const fetchLandlord = async()=> {
      try {
        const res = await fetch (`https://edge-estate.onrender.com/api/user/${listing.userRef}`,{
          method:"GET",
          credentials:"include"
        });
        const data = await res.json();
        setLandlord(data);
        console.log(landlord)
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
    {landlord && (
      <div className="flex flex-col gap-2">
        <p>Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span></p>
        <textarea value={message} placeholder="Enter your message here..." className="w-full border border-gray-300 rounded-lg p-3" onChange={onChange} name="message" id="message" rows="2"></textarea>

        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name} &body=${message}`} className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95">
        Send Message
        </Link>
      </div>
    )}
    </>
  )
}

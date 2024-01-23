
function listingCard({props}) {
  return (
    <div className="">
      <img src={img} alt="" />
      <h2>{title}</h2>
      <p>{address}</p>
      <p>{description}</p>
    </div>
  )
}

export default listingCard
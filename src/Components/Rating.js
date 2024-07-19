import React from "react";

function Rating(props) {
  const { rating, numReviews } = props;

  // Calculate the star icons based on the rating
  const stars = [];
  const totalStars = 5; // Total number of stars
  const fullStars = Math.floor(rating); // Number of full stars

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={i} className='fa fa-star' />);
  }

  // Add half star if applicable
  if (rating % 1 !== 0) {
    stars.push(<i key={stars.length} className='fa fa-star-half-alt' />);
  }

  // Add empty stars to fill the remaining space
  for (let i = stars.length; i < totalStars; i++) {
    stars.push(<i key={i} className='fa fa-star' />);
  }

  return (
    <div className='rating'>
      {stars.map((star, index) => (
        <span key={index}>{star}</span>
      ))}
      <span> {numReviews} reviews</span>
    </div>
  );
}

export default Rating;

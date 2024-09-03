import React from 'react';

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={starValue <= rating ? 'star filled' : 'star'}
            onClick={() => setRating(starValue)}
            style={{ cursor: 'pointer', fontSize: '24px' }}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

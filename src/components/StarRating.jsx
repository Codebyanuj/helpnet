import React from 'react';

const StarRating = ({ rating, setRating }) => {
    const handleRating = (value) => {
        setRating(value);
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;

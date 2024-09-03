import React, { useState } from 'react';
import { db } from '../firebase';
import StarRating from './StarRating';

const ReviewForm = ({ workerId, customerId }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('Workers').doc(workerId).collection('Reviews').add({
        customerId,
        rating,
        reviewText,
        createdAt: new Date(),
      });
      setRating(0);
      setReviewText('');
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <StarRating rating={rating} setRating={setRating} />
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;

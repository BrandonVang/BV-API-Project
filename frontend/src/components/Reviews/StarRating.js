import { useState } from "react";
import "./ReviewDetails.css"

const StarRating= ({ rating, disabled, onChange }) => {
    const [activeRating, setActiveRating] = useState(rating);

    const handleMouseEnter = (star) => {
        if (!disabled) {
            setActiveRating(star);
        }
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setActiveRating(rating);
        }
    };

    const handleClick = (star) => {
        if (!disabled) {
            onChange(star);
        }
    };

    return (
        <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
                <div
                    key={star}
                    className={activeRating >= star ? "filled" : "empty"}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star)}
                >
                    <i className="fa fa-star"></i>
                </div>
            ))}
        </div>
    );
};

export default StarRating;

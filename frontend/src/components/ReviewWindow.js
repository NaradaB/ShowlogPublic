import React, { useEffect, useState } from "react";
import "./ReviewWindow.css";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import axios from "axios";
import Cookies from "js-cookie";

import { currentShow, reviewWindow } from "../Atoms/HomepageAtoms";

import { useRecoilState } from "recoil";

import { useNavigate } from "react-router-dom";

function ReviewWindow() {
  const [show, setShow] = useRecoilState(currentShow);
  const [review, setReview] = useRecoilState(reviewWindow);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const navigate = useNavigate();

  const handleReview = (e) => {
    setReviewText(e.target.value);
  };

  function removeFromWatching(id) {
    let data = {
      rating: rating,
      review: reviewText,
    };
    axios
      .put("http://localhost:6969/shows/finishShow/" + id, data, {
        headers: { accessToken: Cookies.get("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          navigate("/login");
        } else {
          document.getElementById(id).remove();
          setReview(false);
        }
      });
  }

  return review ? (
    <div className="review-window-wrapper">
      <div className="review-window">
        <div>
          <img className="show-image" src={show.poster_path} />
        </div>
        <div className="right-side">
          <div className="review-title-text">
            <div className="show-name">{show.name}</div>
            <div className="review-title">- Your review</div>
          </div>

          <div className="input-holder">
            <textarea
              className="input-field"
              type="text"
              onChange={handleReview}
            ></textarea>
            <div className="rating-text">Your Rating</div>
            <div className="rate-and-submit">
              <Rating
                name="simple-controlled"
                value={rating}
                size="large"
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <Button
                sx={{
                  marginLeft: "5px",
                }}
                variant="outlined"
                color="error"
                onClick={() => setReview(false)}
              >
                Cancel
              </Button>
              <Button
                sx={{
                  marginLeft: "5px",
                }}
                variant="outlined"
                onClick={() => removeFromWatching(show.id)}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ReviewWindow;

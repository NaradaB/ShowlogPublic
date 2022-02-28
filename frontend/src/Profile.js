import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

import "./Profile.css";

import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

function Profile() {
  let { username } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:6969/shows/getReviews/" + username, {
        headers: { accessToken: Cookies.get("accessToken") },
      })
      .then((response) => {
        response.data.forEach(function (item, index) {
          axios
            .get("http://localhost:6969/shows/getShow/" + item.showid)
            .then((response) => {
              item.title = response.data.name;
              item.poster_path = response.data.poster_path;
              item.description = response.data.overview;
              setReviews((reviews) => [...reviews, item]);
            });
        });
      });
  }, [username]);

  useEffect(() => {
    console.log(reviews);
  }, [reviews]);

  return (
    <div>
      <Navbar className="nav_container" variant="dark">
        <Container>
          <a className="link" href="/">
            <div className="logo_homepage">SHOWLOG</div>
          </a>
          <Nav className="me-auto">
            <Nav.Link href="/collection">Collection</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="username-title">{username}s Collection</div>

      <div className="tiles">
        {reviews.map((value, key) => {
          return (
            <div id={value.id} className="collection_item_wrapper_collection">
              <div>
                <div className="collection">
                  <div className="collection_item_collection">
                    <img
                      className="collection_item_image_collection"
                      src={value.poster_path}
                    />
                  </div>
                </div>
              </div>
              <div className="right-container">
                <div className="review-info">
                  <div className="show-name-collection">{value.title}</div>
                  <Rating
                    name="read-only"
                    value={value.review_score}
                    readOnly
                  />
                  <div className="divider-collection" />
                  <div className="review-text-title">{username}s review</div>
                  <div className="review-text">{value.review_comment}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;

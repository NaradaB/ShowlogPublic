import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";

//recoil
import { useRecoilState } from "recoil";

import { currentShow, reviewWindow } from "./Atoms/HomepageAtoms.js";

//components
import ReviewWindow from "./components/ReviewWindow";

import { useNavigate } from "react-router-dom";

function Homepage() {
  const [search, setSearch] = useState("");
  const [watchingList, setWatchingList] = useState([]);
  const [review, setReview] = useRecoilState(reviewWindow);
  const [show, setShow] = useRecoilState(currentShow);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  function searchShow() {
    navigate("/search/" + search);
  }

  useEffect(() => {
    axios
      .get("http://localhost:6969/shows/getWatching/", {
        headers: { accessToken: Cookies.get("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          navigate("/login");
        } else {
          response.data.forEach(function (item, index) {
            axios
              .get("http://localhost:6969/shows/getShow/" + item.showid)
              .then((response) => {
                setWatchingList((watchingList) => [
                  ...watchingList,
                  response.data,
                ]);
              });
          });
        }
      });
  }, []);


  function openReviewWindow(show) {
    setShow(show);
    setReview(true);
  }


  return (
    <div className="homepage">
      <div className="main_container">
        <Navbar className="nav_container" variant="dark">
          <Container>
            <a href="/" className="link">
              <div className="logo_homepage">SHOWLOG</div>
            </a>
            <Nav className="me-auto">
              <Nav.Link href="/collection">Collection</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <div className="search_bar_container">
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              backgroundColor: "#181818",
              alignItems: "center",
              width: 400,
            }}
          >
            <InputBase
              onChange={handleSearch}
              sx={{ ml: 1, flex: 1, color: "white" }}
              placeholder="Search for Shows & Movies"
              inputProps={{ "aria-label": "Search for Shows & Movies" }}
            />

            <IconButton
              onClick={() => searchShow()}
              sx={{ p: "10px", color: "white" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div className="username-title">Currently Watching</div>
        <div className="tiles">
          {watchingList.map((value, key) => {
            return (
              <div id={value.id} className="collection_item_wrapper">
                <div className="collection_item">
                  <img
                    className="collection_item_image"
                    src={value.poster_path}
                  />
                </div>
                <Button
                  style={{ height: "40px", width: "100%" }}
                  onClick={() => openReviewWindow(value)}
                  variant="outlined"
                >
                  Mark as Finished
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <ReviewWindow trigger={reviewWindow}></ReviewWindow>
    </div>
  );
}

export default Homepage;

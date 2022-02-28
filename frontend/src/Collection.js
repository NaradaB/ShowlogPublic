import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

import { useNavigate } from "react-router-dom";

function Collection() {
    const [collectionList, setCollectionList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        console.log(collectionList);
    }, [collectionList]);

    useEffect(() => {
        axios
            .get("http://localhost:6969/shows/getFinished/", {
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
                                response.data.userRating = item.review_score;
                                response.data.userReview = item.review_comment;
                                setCollectionList((collectionList) => [
                                    ...collectionList,
                                    response.data,
                                ]);
                            });
                    });
                }
            });
    }, []);

    function removeFromCollection(id) {
        axios
            .put("http://localhost:6969/shows/unfinish/" + id, null, {
                headers: { accessToken: Cookies.get("accessToken") },
            })
            .then((response) => {
                if (response.data.error) {
                    navigate("/login");
                } else {
                    document.getElementById(id).remove();
                }
            });
    }

    function deleteShow(id) {
        axios
            .post("http://localhost:6969/shows/deleteShow/" + id, null, {
                headers: { accessToken: Cookies.get("accessToken") },
            })
            .then((response) => {
                if (response.data.error) {
                    navigate("/login");
                } else {
                    document.getElementById(id).remove();
                }
            });
    }

    return (
        <div className="collection_page">
            <div className="main_container"></div>{" "}
            <Navbar className="nav_container" variant="dark">
                <Container>
                    <a className="link" href="/">
                        <div className="logo_homepage">SHOWLOG</div>
                    </a>
                    <Nav className="me-auto">
                        <Nav.Link href="">Collection</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className="username-title">Your Collection</div>
            <div className="tiles-collection">
                {collectionList.map((value, key) => {
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
                                    <div className="show-name-collection">{value.name}</div>
                                    <Rating name="read-only" value={value.userRating} readOnly />
                                    <div className="divider-collection" />
                                    <div className="review-text-title">Your review</div>
                                    <div className="review-text">{value.userReview}</div>
                                </div>
                                <div className="button_container_collection">
                                    <Button
                                        style={{ height: "40px", width: "100%" }}
                                        onClick={() => removeFromCollection(value.id)}
                                        variant="outlined"
                                    >
                                        Unfinish
                                    </Button>
                                    <div className="margin"></div>
                                    <Button
                                        style={{ height: "40px", width: "100%" }}
                                        onClick={() => deleteShow(value.id)}
                                        color="error"
                                        variant="outlined"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Collection;

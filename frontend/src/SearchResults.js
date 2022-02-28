import React, { useEffect, useState } from 'react';
import './SearchResults.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

function SearchResults() {
	const [searchQuery, setSearchQuery] = useState(useParams());
	const [shows, setShows] = useState([]);
	const [collection, setCollection] = useState([]);
	const localCollection = [];
	const [fetched, setFetched] = useState(false);

	const [search, setSearch] = useState('');

	const navigate = useNavigate();

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	function searchShow() {
		let searchQuery = { searchQuery: search };
		navigate('/search/' + searchQuery.searchQuery);
		window.location.reload(false);
	}

	useEffect(
		() => {
			console.log(shows);
		},
		[shows]
	);

	useEffect(
		() => {
			axios
				.get('http://localhost:6969/shows/show/' + searchQuery.searchQuery, {
					headers: { accessToken: Cookies.get('accessToken') }
				})
				.then((response) => {
					if (response.data.error) {
						navigate('/login');
					} else {
						setShows(response.data);
					}
				});
		},
		[searchQuery, collection]
	);

	useEffect(() => {
		axios
			.get('http://localhost:6969/shows/getShows/', {
				headers: { accessToken: Cookies.get('accessToken') }
			})
			.then((response) => {
				let tempArray = [];
				if (response.data.error) {
					navigate('/login');
				} else {
					response.data.forEach(function (item, index) {
						localCollection.push(item.showid);
						console.log(localCollection);
						tempArray.push(item.showid);
					});

					setCollection(tempArray);
				}
			});
	}, []);

	function returnAddButton(id) {
		if (collection.includes(id.toString())) {
			return (
				<div className="add_button_wrapper">
					<Button
						id={id}
						className="add_button"
						variant="outlined"
						onClick={() => removeFromCollection(id)}
						color="success"
					>
						In Collection
					</Button>
				</div>
			);
		} else {
			return (
				<div className="add_button_wrapper">
					<Button id={id} className="add_button" variant="outlined" onClick={() => addToCollection(id)}>
						Add to Collection
					</Button>
				</div>
			);
		}
	}

	async function removeFromCollection(id) {
		let data = { showid: id };
		await axios
			.post('http://localhost:6969/shows/deleteShow/', data, {
				headers: { accessToken: Cookies.get('accessToken') }
			})
			.then((response) => {
				const toChange = document.getElementById(id);

				toChange.innerText = 'Add to Collection';
			});
	}

	async function addToCollection(id) {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = dd + '/' + mm + '/' + yyyy;
		let data = {
			showid: id.toString(),
			date_added: today,
			finished: 0,
			comment: '',
			review_score: 0
		};

		await axios
			.post('http://localhost:6969/shows/addShow/', data, {
				headers: { accessToken: Cookies.get('accessToken') }
			})
			.then((response) => {
				const toChange = document.getElementById(id);

				toChange.innerText = 'In Collection';
				toChange.color = 'success';

				// setCollection((collection) => [ ...collection, id ]);
			});
	}

	return (
		<div className="homepage">
			<div className="main_container">
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
				<div className="search_bar_container">
					<Paper
						sx={{
							p: '2px 4px',
							display: 'flex',
							backgroundColor: '#181818',
							alignItems: 'center',
							width: 400
						}}
					>
						<InputBase
							onChange={handleSearch}
							sx={{ ml: 1, flex: 1, color: 'white' }}
							placeholder="Search for Shows & Movies"
							inputProps={{ 'aria-label': 'Search for Shows & Movies' }}
						/>
						<IconButton onClick={() => searchShow()} sx={{ p: '10px', color: 'white' }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>
				</div>
				<div className="tiles">
					{shows.map((value, key) => {
						return (
							<div className="show">
								<img className="show_image" src={value.poster_path} />

								<div className="details">
									<div className="show_title">
										{value.name}
									</div>
									<div className="divider" />
									<div className="des_wrapper">
										<div className="show_des">{value.overview}</div>
									</div>
									{returnAddButton(value.id)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default SearchResults;

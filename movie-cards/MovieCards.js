class MovieCards extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		this.fetchData();
	}

	async fetchData() {
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjhiMDY0YjBiMzBjZmUwNDk2Y2U2MmRlOWU5ZDAyMiIsInN1YiI6IjY1ZjZlMjExZTE5NGIwMDE3Y2JlZDRhOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vot1J9mnq6QE-7ee3XDdI-Wv76oNAFf2K-NDbQos0N4'
			}
		};

		try {
			const [nowPlayingResponse, genresResponse] = await Promise.all([
				fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options),
				fetch('https://api.themoviedb.org/3/genre/movie/list', options)
			]);
			const nowPlayingData = await nowPlayingResponse.json();
			const genresData = await genresResponse.json();

			this.renderCards(nowPlayingData.results, genresData.genres);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	renderCards(data, genres) {
		const content = document.createElement('div');
		content.classList.add('moviesContainer');

		data.forEach(movie => {
			// Update genres_ids with genres names
			const updatedGenres = movie.genre_ids.map(genreId => {
				const matchingGenre = genres.find(genre => genre.id === genreId);
				return matchingGenre ? matchingGenre.name : 'General';
			});
			const updatedMovie = { ...movie, genres: updatedGenres, genre_ids: undefined };

			const movieCard = document.createElement('movie-card');
			movieCard.setAttribute('movie', JSON.stringify(updatedMovie));
			content.appendChild(movieCard);
		});

		this.shadowRoot.appendChild(content);
	}

	render() {
		// Link the external CSS file
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'movie-cards/movie-cards.css');

		// Append link element to shadow DOM
		this.shadowRoot.appendChild(linkElem);
	}
}

customElements.define('movie-cards', MovieCards);

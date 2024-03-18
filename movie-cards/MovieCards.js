class MovieCards extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.page = 1; // Track current page
		this.isLoading = false; // Track loading state
		this.moviesContainer = null; // Reference to movies container
		this.genres = [];
	}

	connectedCallback() {
		this.render();
		this.fetchGenres();
		this.fetchData();
		this.setupScrollListener();
	}

	async fetchGenres() {
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjhiMDY0YjBiMzBjZmUwNDk2Y2U2MmRlOWU5ZDAyMiIsInN1YiI6IjY1ZjZlMjExZTE5NGIwMDE3Y2JlZDRhOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vot1J9mnq6QE-7ee3XDdI-Wv76oNAFf2K-NDbQos0N4'
			}
		};

		try {
			const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
			const data = await response.json();
			this.genres = data.genres;
		} catch (error) {
			console.error('Error fetching genres:', error);
		}
	}

	setupScrollListener() {
		window.addEventListener('scroll', () => {
			if (this.shouldFetchMoreData()) {
				this.fetchData();
			}
		});
	}

	shouldFetchMoreData() {
		// Check if the user has scrolled to the bottom
		return (
			window.innerHeight + window.scrollY >= document.body.offsetHeight &&
			!this.isLoading
		);
	}

	async fetchData() {
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNjhiMDY0YjBiMzBjZmUwNDk2Y2U2MmRlOWU5ZDAyMiIsInN1YiI6IjY1ZjZlMjExZTE5NGIwMDE3Y2JlZDRhOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vot1J9mnq6QE-7ee3XDdI-Wv76oNAFf2K-NDbQos0N4'
			}
		};

		this.isLoading = true;

		try {
			const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${this.page}`, options);
			const data = await response.json();

			this.renderCards(data.results);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			this.isLoading = false;
			this.page++;
		}
	}

	renderCards(data) {
		if (!this.moviesContainer) {
			this.moviesContainer = document.createElement('div');
			this.moviesContainer.classList.add('moviesContainer');
			this.shadowRoot.appendChild(this.moviesContainer);
		}

		data.forEach(movie => {
			const updatedGenres = movie.genre_ids.map(genreId => {
				const matchingGenre = this.genres.find(genre => genre.id === genreId);
				return matchingGenre ? matchingGenre.name : 'General';
			});
			const updatedMovie = { ...movie, genres: updatedGenres, genre_ids: undefined };
			const movieCard = document.createElement('movie-card');
			movieCard.setAttribute('movie', JSON.stringify(updatedMovie));
			this.moviesContainer.appendChild(movieCard);
		});
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

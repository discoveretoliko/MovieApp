class MovieCard extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
	}

	static get observedAttributes() {
		return ['movie'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.renderCard(JSON.parse(this.getAttribute('movie')));
	}

	renderCard(movie) {
		const genres = movie.genres.map(genre => `<p class="genre">${genre}</p>`).join('');

		const itemCard =  `
			<div class="cardDetails">
    		<h2>${movie.original_title}</h2>
    		<p class="cardOverview">${movie.overview}</p>
    		<p>${new Date(movie.release_date).getFullYear()}</p>
    		<p>Stars: ${movie.vote_average}</p>
    		<div class="wrapGenres">
    			${genres} 
    		</div>
    	</div>
    	<img class="posterImage" src='https://image.tmdb.org/t/p/original/${movie.poster_path}' alt>
		`

		this.shadowRoot.innerHTML = itemCard;
	}

	render() {
		// Link the external CSS file
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'movie-cards/movie-card/movie-card.css');

		// Append link element to shadow DOM
		this.shadowRoot.appendChild(linkElem);
		this.shadowRoot.host.classList.add('wrapCard');
	}
}

customElements.define('movie-card', MovieCard);

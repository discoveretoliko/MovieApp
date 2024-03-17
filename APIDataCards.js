class APIDataCards extends HTMLElement {
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
			const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options);
			const data = await response.json();
			this.renderCards(data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	renderCards(data) {
		const content = document.createElement('div');
		content.classList.add('moviesContainer');

		const itemsHTML = data.results.map(item => `
				<div class="wrapCard">
					<div class="cardDetails">
         		<h2>${item.original_title}</h2>
         		<p class="cardOverview">${item.overview}</p>
         		<p>${new Date(item.release_date).getFullYear()}</p>
         		<p>Stars: ${item.vote_average}</p>
         	</div>
         	<img class="posterImage" src='https://image.tmdb.org/t/p/original/${item.poster_path}' alt>
        </div>
       `).join('');

		content.innerHTML = itemsHTML
		this.shadowRoot.appendChild(content);

	}

	render() {
		// Link the external CSS file
		const linkElem = document.createElement('link');
		linkElem.setAttribute('rel', 'stylesheet');
		linkElem.setAttribute('href', 'styles.css');

		// Append link element to shadow DOM
		this.shadowRoot.appendChild(linkElem);
	}
}

customElements.define('api-data-cards', APIDataCards);

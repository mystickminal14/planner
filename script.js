const UNSPLASH_ACCESS_KEY = 'iEvc6jd120BizU9zu2wZbmNwDFgTuU8Z-wD0a7R4DPc';

const categorySelect = document.getElementById('category-select');
const loadPlacesButton = document.getElementById('load-places');
const placesContainer = document.getElementById('places-container');

const recommendations = {
    nature: ['Pokhara', 'Chitwan National Park', 'Rara Lake'],
    adventure: ['Pokhara', 'Annapurna Base Camp', 'Bhote Koshi'],
    historical: ['Pokhara', 'Lumbini', 'Kathmandu Durbar Square']
};

async function fetchImage(placeName, category) {
    try {
        const query = `${placeName} Nepal ${category}`;
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular;
        }
        return 'https://via.placeholder.com/300?text=No+Image';
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'https://via.placeholder.com/300?text=Error';
    }
}

async function fetchDescription(placeName) {
    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(placeName)}&format=json&origin=*`);
        const data = await response.json();
        const page = Object.values(data.query.pages)[0];
        return page.extract ? page.extract.substring(0, 200) + '...' : 'No description available';
    } catch (error) {
        console.error('Error fetching description:', error);
        return 'Error fetching description';
    }
}

async function loadPlaces() {
    const category = categorySelect.value;
    placesContainer.innerHTML = '<p>Loading places...</p>';

    const places = recommendations[category];
    placesContainer.innerHTML = ''; // Clear previous content

    for (const place of places) {
        const [description, imageUrl] = await Promise.all([
            fetchDescription(place),
            fetchImage(place, category)
        ]);

        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${imageUrl}" alt="${place}">
            <h3>${place}</h3>
            <p>${description}</p>
        `;
        placesContainer.appendChild(card);
    }
}

loadPlacesButton.addEventListener('click', loadPlaces);

categorySelect.addEventListener('change', loadPlaces);

loadPlaces();
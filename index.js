import * as Carousel from "./Carousel.js";


// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_y5ZsZswZaDEwwgV1BrjCeQmfmrtw7KpivX7lidBnS6iXi1GTTIncosaxp8vV0WJo";

const axiosInstance = axios.create({
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json", // You can adjust this content type based on your needs
  },
});

async function initialLoad() {
  try {
    const response = await axiosInstance.get("https://api.thecatapi.com/v1/breeds");
    const breeds = response.data;
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading breeds:", error);
  }
}

initialLoad();

// async function initialLoad() {
//   try {
//     const response = await axios.get("https://api.thecatapi.com/v1/breeds");
//     const breeds = response.data;
//     breeds.forEach((breed) => {
//       const option = document.createElement("option");
//       option.value = breed.id;
//       option.textContent = breed.name;
//       breedSelect.appendChild(option);
//     });
//   } catch (error) {
//     console.error("Error loading breeds:", error);
//   }
// }
//
// initialLoad();

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener("change", async function () {
  const selectedBreedId = breedSelect.value;

  try {
    // Clear the carousel and infoDump
    Carousel.clear();
    infoDump.innerHTML = "";

    // Fetch information about the selected breed
    const breedResponse = await axiosInstance.get(
      `https://api.thecatapi.com/v1/breeds/${selectedBreedId}`
    );

    const breed = breedResponse.data;

    // Display breed information in the infoDump element
    const breedInfoDiv = document.createElement("div");
    breedInfoDiv.innerHTML = `
      <h3>${breed.name}</h3>
      <p><strong>Description:</strong> ${breed.description}</p>
      <p><strong>Origin:</strong> ${breed.origin}</p>
      <p><strong>Life Span:</strong> ${breed.life_span}</p>
    `;
    infoDump.appendChild(breedInfoDiv);

    // Fetch images for the selected breed
    const imagesResponse = await axiosInstance.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=5`
    );

    const images = imagesResponse.data;

    // Create carousel items for each image
    images.forEach((image) => {
      const carouselItem = Carousel.createCarouselItem(
        image.url,
        `Image of ${breed.name}`,
        image.id
      );

      // Append carousel items to the carousel
      Carousel.appendCarousel(carouselItem);
    });

    // Restart the carousel
    Carousel.start();
  } catch (error) {
    console.error("Error handling breed selection:", error);
  }
});

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */
axiosInstance.interceptors.request.use(
  function (config) {
    // Log the time when the request begins
    config.metadata = { startTime: new Date() };
    console.log(`Request started for ${config.url} at ${config.metadata.startTime}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // Calculate the time taken for the request and log it
    const endTime = new Date();
    const startTime = response.config.metadata.startTime;
    const duration = endTime - startTime;
    console.log(`Request finished for ${response.config.url}. Time taken: ${duration}ms`);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

progressBar.style.width = '0%';

// Axios interceptors with onDownloadProgress to update the progress bar
axiosInstance.interceptors.request.use(
  function (config) {
    // Reset the progress bar with each request
    progressBar.style.width = '0%';

    // Log the time when the request begins
    config.metadata = { startTime: new Date() };
    console.log(`Request started for ${config.url} at ${config.metadata.startTime}`);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    const endTime = new Date();
    const startTime = response.config.metadata.startTime;
    const duration = endTime - startTime;
    console.log(`Request finished for ${response.config.url}. Time taken: ${duration}ms`);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Function to update the progress bar
function updateProgress(event) {
  console.log('blabla:', event)
  if (event.event.lengthComputable) {
    const percentage = (event.loaded / event.total) * 100;
    progressBar.style.width = `${percentage}%`;
    console.log('perc: ', percentage)

    // Log the ProgressEvent object
    console.log('ProgressEvent:', event);
  }
}

// Attach the updateProgress function to the onDownloadProgress config option
axiosInstance.interceptors.request.use(function (config) {
  config.onDownloadProgress = updateProgress;
  return config;
}, function (error) {
  return Promise.reject(error);
});

// ...

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
axiosInstance.interceptors.request.use(
  function (config) {
    document.body.style.cursor = 'progress';
    return config;
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    document.body.style.cursor = 'default';
    return response;
  }
);


/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  try {
    // Check if the image is already favorited
    const existingFavorite = await axiosInstance.get(`https://api.thecatapi.com/v1/favourites`, {
      params: {
        image_id: imgId,
      },
    });

    if (existingFavorite.data.length > 0) {
      // If the image is already favorited, unfavorite it
      const favoriteId = existingFavorite.data[0].id;
      await axiosInstance.delete(`https://api.thecatapi.com/v1/favourites/${favoriteId}`);
      console.log(`Image with ID ${imgId} unfavorited.`);
    } else {
      // If the image is not favorited, favorite it
      await axiosInstance.post(`https://api.thecatapi.com/v1/favourites`, {
        image_id: imgId,
      });
      console.log(`Image with ID ${imgId} favorited.`);
    }
  } catch (error) {
    console.error(`Error favoriting/unfavoriting image with ID ${imgId}:`, error);
  }
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */


export async function getFavourites() {
  try {
    Carousel.clear();
    infoDump.innerHTML = "";

    // Fetch all favorites from the cat API
    const response = await axiosInstance.get(`https://api.thecatapi.com/v1/favourites`);
    const favorites = response.data;

    // Display favorites in the carousel
    favorites.forEach(async (favorite) => {
      // Fetch image details for the favorite
      const imageResponse = await axiosInstance.get(`https://api.thecatapi.com/v1/images/${favorite.image_id}`);
      const image = imageResponse.data;

      // Create carousel item for the favorite
      const carouselItem = Carousel.createCarouselItem(
        image.url,
        `Favorite image of ${image.breeds[0].name}`,
        favorite.image_id
      );

      // Append carousel items to the carousel
      Carousel.appendCarousel(carouselItem);
    });

    // Restart the carousel
    Carousel.start();
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

getFavouritesBtn.addEventListener("click", getFavourites);

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */

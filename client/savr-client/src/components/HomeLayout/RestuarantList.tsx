import axios from 'axios';
import { useEffect, useState } from 'react';

interface Restaurant {
  name: string;
  address: string;
  logo: string;
  menu_images: string[];
}

export function RestuarantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(
          'http://127.0.0.1:8000/api/restaurants'
        );
        setRestaurants(response.data);
      } catch (error) {
        setError('Failed to fetch restaurants');
        // TODO: Replace with proper error logging service
        console.error('Error fetching restaurants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (isLoading) {
    return (
      <main>
        <p>Loading restaurants...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <section>
        {restaurants.map((restaurant, index) => (
          <article key={`${restaurant.name}-${index}`}>
            <header>
              <h2>{restaurant.name}</h2>
              <address>{restaurant.address}</address>
            </header>
            <figure>
              <img
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                width={100}
                height={100}
              />
            </figure>
            <section>
              <h3>Menu Images</h3>
              <div>
                {restaurant.menu_images.map((image, imageIndex) => (
                  <img
                    key={`${restaurant.name}-menu-${imageIndex}`}
                    src={image}
                    alt={`${restaurant.name} menu ${imageIndex + 1}`}
                    width={100}
                    height={100}
                  />
                ))}
              </div>
            </section>
          </article>
        ))}
      </section>
    </main>
  );
}

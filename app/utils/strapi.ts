// utils/strapi.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export async function fetchAPI(path: string) {
  try {
    const url = `${API_URL}/api${path}`;
    console.log(`url`, url);
    const response = await axios.get(url);

    console.log(`response.data`, response.data);

    return response.data;
  } catch (error) {
    console.error('Strapi API Error:', error);
    return null;
  }
}

export async function getPageData(slug: string) {
  const data = await fetchAPI(`/page?filters[slug][$eq]=${slug}&populate=*`);
  if (data && data.data) {
    return data.data;
  }
  return null;
}
import { default_api } from './tools';

export { default_api };

export const getLegalTexts = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/legal-texts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch legal texts:', error);
    return [];
  }
};

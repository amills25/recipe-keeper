import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the webpage content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
    }

    const html = await response.text();
    
    // Extract recipe data using JSON-LD structured data
    const recipeData = extractRecipeFromHTML(html, url);
    
    if (!recipeData) {
      return NextResponse.json({ error: 'No recipe data found on this page' }, { status: 400 });
    }

    return NextResponse.json({ recipe: recipeData });
  } catch (error) {
    console.error('Error importing recipe:', error);
    return NextResponse.json({ error: 'Failed to import recipe' }, { status: 500 });
  }
}

function extractRecipeFromHTML(html, sourceUrl) {
  try {
    // Look for JSON-LD structured data
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        const jsonContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
        try {
          const data = JSON.parse(jsonContent);
          const recipe = findRecipeInJsonLd(data);
          if (recipe) {
            return processRecipeData(recipe, sourceUrl);
          }
        } catch (e) {
          // Continue to next JSON-LD block
        }
      }
    }

    // Fallback to meta tags and common selectors
    return extractFromMetaTags(html, sourceUrl);
  } catch (error) {
    console.error('Error extracting recipe:', error);
    return null;
  }
}

function findRecipeInJsonLd(data) {
  if (Array.isArray(data)) {
    for (const item of data) {
      const recipe = findRecipeInJsonLd(item);
      if (recipe) return recipe;
    }
  } else if (data && typeof data === 'object') {
    if (data['@type'] === 'Recipe') {
      return data;
    }
    // Check nested objects
    for (const key in data) {
      if (typeof data[key] === 'object') {
        const recipe = findRecipeInJsonLd(data[key]);
        if (recipe) return recipe;
      }
    }
  }
  return null;
}

function processRecipeData(recipe, sourceUrl) {
  const name = recipe.name || 'Imported Recipe';
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Process ingredients
  let ingredients = [];
  if (recipe.recipeIngredient) {
    ingredients = recipe.recipeIngredient.map(ingredient => ({
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: ingredient }]
    }));
  }

  // Process instructions
  let instructions = [];
  if (recipe.recipeInstructions) {
    instructions = recipe.recipeInstructions.map((instruction, index) => {
      let text = '';
      if (typeof instruction === 'string') {
        text = instruction;
      } else if (instruction.text) {
        text = instruction.text;
      } else if (instruction.name) {
        text = instruction.name;
      }
      
      return {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: `${index + 1}. ${text}` }]
      };
    });
  }

  // Extract time values (convert from ISO 8601 duration format)
  const prepTime = parseDuration(recipe.prepTime) || 0;
  const cookTime = parseDuration(recipe.cookTime) || parseDuration(recipe.totalTime) || 0;

  // Determine cuisine and meal type from keywords or category
  const keywords = recipe.keywords || [];
  const category = recipe.recipeCategory || [];
  const cuisine = guessCuisine([...keywords, ...category]) || 'International';
  const meal = guessMealType([...keywords, ...category]) || 'Dinner';

  // Extract author
  let author = 'Unknown';
  if (recipe.author) {
    if (typeof recipe.author === 'string') {
      author = recipe.author;
    } else if (Array.isArray(recipe.author) && recipe.author.length > 0) {
      const firstAuthor = recipe.author[0];
      author = typeof firstAuthor === 'string' ? firstAuthor : (firstAuthor.name || 'Unknown');
    } else if (recipe.author.name) {
      author = recipe.author.name;
    }
  }

  // Extract image
  let imageUrl = null;
  if (recipe.image) {
    if (typeof recipe.image === 'string') {
      imageUrl = recipe.image;
    } else if (Array.isArray(recipe.image) && recipe.image.length > 0) {
      const firstImage = recipe.image[0];
      imageUrl = typeof firstImage === 'string' ? firstImage : (firstImage.url || null);
    } else if (recipe.image.url) {
      imageUrl = recipe.image.url;
    }
  }

  return {
    name,
    slug: { current: slug },
    ingredients,
    cookingInstructions: instructions,
    prepTime,
    cookTime,
    cuisine,
    meal,
    author,
    source: sourceUrl,
    imageUrl
  };
}

function extractFromMetaTags(html, sourceUrl) {
  // Simple fallback extraction using common meta tags and selectors
  const getMetaContent = (property) => {
    const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
  };

  const name = getMetaContent('og:title') || 
                getMetaContent('twitter:title') || 
                html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || 
                'Imported Recipe';

  const slug = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const author = getMetaContent('author') || 'Unknown';
  const imageUrl = getMetaContent('og:image') || getMetaContent('twitter:image') || null;

  return {
    name: name.replace(/\s*-\s*.*$/, ''), // Remove site name from title
    slug: { current: slug },
    ingredients: [{
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Please add ingredients manually' }]
    }],
    cookingInstructions: [{
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text: 'Please add cooking instructions manually' }]
    }],
    prepTime: 0,
    cookTime: 0,
    cuisine: 'International',
    meal: 'Dinner',
    author,
    source: sourceUrl,
    imageUrl
  };
}

function parseDuration(duration) {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  
  // Parse ISO 8601 duration format (PT15M = 15 minutes)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (match) {
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    return hours * 60 + minutes;
  }
  
  return 0;
}

function guessCuisine(keywords) {
  const cuisineKeywords = {
    'Italian': ['italian', 'pasta', 'pizza', 'risotto', 'parmesan'],
    'Mexican': ['mexican', 'taco', 'burrito', 'salsa', 'cilantro'],
    'Asian': ['asian', 'soy sauce', 'ginger', 'sesame', 'rice'],
    'Chinese': ['chinese', 'wok', 'stir fry', 'soy sauce'],
    'Indian': ['indian', 'curry', 'turmeric', 'garam masala', 'naan'],
    'French': ['french', 'butter', 'wine', 'herbs de provence'],
    'American': ['american', 'bbq', 'burger', 'southern']
  };

  const keywordString = keywords.join(' ').toLowerCase();
  
  for (const [cuisine, words] of Object.entries(cuisineKeywords)) {
    if (words.some(word => keywordString.includes(word))) {
      return cuisine;
    }
  }
  
  return null;
}

function guessMealType(keywords) {
  const mealKeywords = {
    'Breakfast': ['breakfast', 'morning', 'cereal', 'pancake', 'waffle', 'oatmeal'],
    'Lunch': ['lunch', 'sandwich', 'salad', 'soup'],
    'Dinner': ['dinner', 'main course', 'entree'],
    'Dessert': ['dessert', 'cake', 'cookie', 'pie', 'sweet', 'chocolate'],
    'Snack': ['snack', 'appetizer', 'finger food'],
    'Drink': ['drink', 'beverage', 'smoothie', 'cocktail']
  };

  const keywordString = keywords.join(' ').toLowerCase();
  
  for (const [meal, words] of Object.entries(mealKeywords)) {
    if (words.some(word => keywordString.includes(word))) {
      return meal;
    }
  }
  
  return null;
}
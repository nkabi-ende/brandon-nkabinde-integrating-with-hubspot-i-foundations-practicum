const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'pug');
app.use(express.static('public'));

// IMPORTANT: Replace with YOUR custom object type ID from Step 4
const CUSTOM_OBJECT_TYPE = '2-53318454';
const ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS;

// Configure axios defaults
const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// ROUTE 1: Homepage - Display custom objects in table
app.get('/', async (req, res) => {
  try {
    const response = await hubspotClient.get(
      `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        params: {
          properties: 'name,genre,rating',
          limit: 100
        }
      }
    );

    const customObjects = response.data.results;

    res.render('homepage', {
      title: 'Video Games Collection',
      customObjects: customObjects
    });
  } catch (error) {
    console.error('Error fetching custom objects:', error.response?.data || error.message);
    res.status(500).send('Error fetching data from HubSpot');
  }
});

// ROUTE 2: Update form - GET (Display the form)
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3: Update form - POST (Create new record)
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, genre, rating } = req.body;

    await hubspotClient.post(
      `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        properties: {
          name: name,
          genre: genre,
          rating: rating
        }
      }
    );

    // Redirect back to homepage after successful creation
    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object:', error.response?.data || error.message);
    res.status(500).send('Error creating record in HubSpot');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 View your app at: http://localhost:${PORT}`);
});

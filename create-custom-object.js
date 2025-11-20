const axios = require('axios');
require('dotenv').config();

const createCustomObject = async () => {
  try {
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/schemas',
      {
        name: 'video_games',
        labels: {
          singular: 'Video Game',
          plural: 'Video Games'
        },
        description: 'Video games in our collection',
        primaryDisplayProperty: 'name',
        requiredProperties: ['name'],
        searchableProperties: ['name', 'genre'],
        properties: [
          {
            name: 'name',
            label: 'Name',
            type: 'string',
            fieldType: 'text',
            hasUniqueValue: true
          },
          {
            name: 'genre',
            label: 'Genre',
            type: 'string',
            fieldType: 'text'
          },
          {
            name: 'rating',
            label: 'Rating',
            type: 'enumeration',
            fieldType: 'select',
            options: [
              { label: 'Everyone', value: 'everyone' },
              { label: 'Teen', value: 'teen' },
              { label: 'Mature', value: 'mature' }
            ]
          }
        ],
        associatedObjects: ['CONTACT']
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ Custom Object Created Successfully!\n');
    console.log('Object Type ID:', response.data.objectTypeId);
    console.log('Name:', response.data.name);
    console.log('\n📋 SAVE THIS OBJECT TYPE ID - You will need it for your application!\n');
    
  } catch (error) {
    console.error('❌ Error creating custom object:');
    console.error(error.response?.data || error.message);
  }
};

createCustomObject();

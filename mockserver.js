const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// API Credentials
const clientId = '65c0a9a4277b2961322c545a-ls8q934d';
const clientSecret = '94af4663-c0c7-4340-9ce5-39b38e88c146';
const redirectUrl = 'https://google.com';
const customFieldName = 'DFS Booking Zoom Link';

// Step 1: Obtain Access Token
const getAccessToken = async () => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      
        };

        const url='https://stoplight.io/mocks/highlevel/integrations/39582851/oauth/token'
        const payload = {
            client_id: '65c0a9a4277b2961322c545a-ls8q934d',
            client_secret: '94af4663-c0c7-4340-9ce5-39b38e88c146',
            grant_type: 'authorization_code',
        }
  try {
    const response = await axios.post(url, payload,{headers})
   
    //console.log(response)
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response.data);
    throw error;
  }
};

// Step 2: Fetch Random Contact
const getRandomContact = async (accessToken) => {
  const url='https://stoplight.io/mocks/highlevel/integrations/39582863/contacts/ocQHyuzHvysMo5N5VsXc';
 
  const headers=
    {
    
      'authorization': `Bearer ${accessToken}`,
      'version' : '2021-07-28'

    }  
  try {
    const response = await axios.get(url,{headers});
   
    return (response.data.contact); // Assuming the response is a list and you're fetching the first contact
  } catch (error) {
    console.error('Error fetching random contact:', error.response);
    throw error;
  }
};


// Step 4: Update Custom Field
const updateCustomField = async (contactId, customFieldId, accessToken) => {
  try {
    const updateFieldUrl = `https://stoplight.io/mocks/highlevel/integrations/39582863/contacts/ocQHyuzHvysMo5N5VsXc`;
    const headers=
    {
      'authorization': `Bearer ${accessToken}`,
      'version' : '2021-07-28'
    } 

    const payload = {
      custom_fields: {
        id : 'DFS Booking Zoom Link',
        value : 'TEST'
      }
    };

    const response = await axios.put(updateFieldUrl, payload, {headers});
    console.log('Custom field updated successfully:', response.data.contact.customFields);
  } catch (error) {
    console.error('Error updating custom field:', error.response.data);
    throw error;
  }
};

// Main function to orchestrate the process
const main = async () => {
  try {
    const accessToken = await getAccessToken();
    console.log(accessToken,'accesstoken')
     const randomContact = await getRandomContact(accessToken);
     await updateCustomField("DFS Booking Zoom Link", accessToken);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Call the main function when the server starts
  main();
});
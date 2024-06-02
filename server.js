const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const client_id = '65c0a9a4277b2961322c545a-ls8q934d';
const client_secret = '94af4663-c0c7-4340-9ce5-39b38e88c146';
const redirect_uri = 'http://127.0.0.1/';

let access_token = '';

// Function to get access token
async function getAccessToken() {
  const token_url = 'https://stoplight.io/mocks/highlevel/integrations/39582851/oauth/token';
  try {
    const response = await axios.post(token_url, {
      grant_type: 'client_credentials',
      client_id,
      client_secret,
      redirect_uri,
    });
    access_token = response.data.access_token;
    console.log('access_token',access_token)
  } catch (error) {
    console.error('Error getting access token:', error.response.data);
  }
}

// Function to fetch a random contact
async function fetchRandomContact() {
  const contacts_url = 'https://stoplight.io/mocks/highlevel/integrations/39582863/contacts/ocQHyuzHvysMo5N5VsXc';
  try {
    const response = await axios.get(contacts_url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const contacts = response.data.contacts;
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
    console.log('randomContact',randomContact)
    return randomContact;
  } catch (error) {
    console.error('Error fetching contacts:', error.response.data);
  }
}

// Function to get custom field ID
async function getCustomFieldId(fieldName) {
  const custom_fields_url = 'https://api.gohighlevel.com/v1/custom-fields';
  try {
    const response = await axios.get(custom_fields_url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const customFields = response.data.customFields;
    const customField = customFields.find(field => field.name === fieldName);
    console.log('customField.id',customField.id)
    return customField.id;
  } catch (error) {
    console.error('Error fetching custom fields:', error.response.data);
  }
}

// Function to update contact's custom field
async function updateCustomField(contactId, customFieldId, value) {
  const update_url = `https://stoplight.io/mocks/highlevel/integrations/39582863
  /contacts/ocQHyuzHvysMo5N5VsXc`;
  try {
    const response = await axios.put(
      update_url,
      {
        customFieldId,
        value,
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating custom field:', error.response.data);
  }
}

app.get('/update-contact', async (req, res) => {
  await getAccessToken();
  
//   const contact = await fetchRandomContact();
//   if (!contact) return res.status(500).send('Failed to fetch contact');
   


  const updateResponse = await updateCustomField( 'ocQHyuzHvysMo5N5VsXc','', 'TEST');
  if (!updateResponse) return res.status(500).send('Failed to update custom field');

  res.send(`Updated contact ${contact.id} with custom field ${ocQHyuzHvysMo5N5VsXc}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

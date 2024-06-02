// src/index.ts
import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

let access_token: string = '';

// API Credentials
const client_id = '65c0a9a4277b2961322c545a-ls8q934d';
const client_secret = '94af4663-c0c7-4340-9ce5-39b38e88c146';
// const redirect_uri = 'https://google.com';
// const customFieldName = 'DFS Booking Zoom Link';





async function getAccessToken(client_id: string, client_secret: string): Promise<void> {
    const token_url = 'https://stoplight.io/mocks/highlevel/integrations/39582851/oauth/token';
    try {
        const payload = new URLSearchParams();
        payload.append('client_id', client_id);
        payload.append('client_secret', client_secret);
        payload.append('grant_type', 'authorization_code');

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const response = await axios.post(token_url, payload, config);
        access_token = response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error access_token');
            console.error('Error getting access token:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}


async function fetchRandomContact() {
    const contacts_url = 'https://stoplight.io/mocks/highlevel/integrations/39582863/contacts/seD4PfOuKoVMLkEZqohJ';
    try {
        const response = await axios.get(contacts_url, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
                Version: '2021-07-28'
            }
        });

        // Assuming response.data is an object where keys are contact IDs
        if (!response.data || typeof response.data !== 'object') {
            console.error('No data found or data is not in the expected format.');
            return null;
        }

        const contacts = response.data

        return contacts;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching contact:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        return null;
    }
}


// Function to update contact's custom field
async function updateCustomField(contactInfo: object) {
    var contactId = 'seD4PfOuKoVMLkEZqohJ'
    const update_url = `https://stoplight.io/mocks/highlevel/integrations/39582863/contacts/${contactId}`;
    try {
        const response = await axios.put(
            update_url,
            contactInfo,
            {
                headers: { Authorization: `Bearer ${access_token}`, Version: '2021-07-28', Accept: 'application/json' },
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error updating custom field:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

app.get('/update-contact', async (req: Request, res: Response) => {
    await getAccessToken(client_id, client_secret);

    const contact = await fetchRandomContact();
    if (!contact) return res.status(500).send('Failed to fetch contact');

    const updateResponse = await updateCustomField(contact);
    if (!updateResponse) return res.status(500).send('Failed to update custom field');

    res.send(`Updated contact ${JSON.stringify(contact)}`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
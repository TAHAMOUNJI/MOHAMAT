import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const defaultData = { clients: [], cases: [] };
const db = new Low(adapter, defaultData);

await db.read();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3001;

// Client routes
app.get('/api/clients', (req, res) => {
  res.json(db.data.clients);
});

app.post('/api/clients', async (req, res) => {
  const client = req.body;
  client.id = Date.now().toString();
  db.data.clients.push(client);
  await db.write();
  res.json(client);
});

app.get('/api/clients/:id', (req, res) => {
  const client = db.data.clients.find(c => c.id === req.params.id);
  if (client) {
    res.json(client);
  } else {
    res.status(404).send('Client not found');
  }
});

app.put('/api/clients/:id', async (req, res) => {
  const clientIndex = db.data.clients.findIndex(c => c.id === req.params.id);
  if (clientIndex > -1) {
    db.data.clients[clientIndex] = { ...db.data.clients[clientIndex], ...req.body };
    await db.write();
    res.json(db.data.clients[clientIndex]);
  } else {
    res.status(404).send('Client not found');
  }
});

app.delete('/api/clients/:id', async (req, res) => {
  const clientIndex = db.data.clients.findIndex(c => c.id === req.params.id);
  if (clientIndex > -1) {
    db.data.clients.splice(clientIndex, 1);
    await db.write();
    res.status(204).send();
  } else {
    res.status(404).send('Client not found');
  }
});

// Case routes
app.get('/api/cases', (req, res) => {
  res.json(db.data.cases);
});

app.post('/api/cases', async (req, res) => {
  const newCase = req.body;
  newCase.id = Date.now().toString();
  db.data.cases.push(newCase);
  await db.write();
  res.json(newCase);
});

app.get('/api/cases/:id', (req, res) => {
    const foundCase = db.data.cases.find(c => c.id === req.params.id);
    if (foundCase) {
        res.json(foundCase);
    } else {
        res.status(404).send('Case not found');
    }
});

app.put('/api/cases/:id', async (req, res) => {
    const caseIndex = db.data.cases.findIndex(c => c.id === req.params.id);
    if (caseIndex > -1) {
        db.data.cases[caseIndex] = { ...db.data.cases[caseIndex], ...req.body };
        await db.write();
        res.json(db.data.cases[caseIndex]);
    } else {
        res.status(404).send('Case not found');
    }
});

app.delete('/api/cases/:id', async (req, res) => {
    const caseIndex = db.data.cases.findIndex(c => c.id === req.params.id);
    if (caseIndex > -1) {
        db.data.cases.splice(caseIndex, 1);
        await db.write();
        res.status(204).send();
    } else {
        res.status(404).send('Case not found');
    }
});

// Legal Texts Scraper Route
app.get('/api/legal-texts', async (req, res) => {
  try {
    const { data } = await axios.get('https://www.joradp.dz');
    const $ = cheerio.load(data);
    const legalTexts = [];
    $('article.post').each((i, el) => {
      const title = $(el).find('h3.post-title a').text();
      const link = $(el).find('h3.post-title a').attr('href');
      if (title && link) {
        legalTexts.push({ title, link });
      }
    });
    res.json(legalTexts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error scraping legal texts');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

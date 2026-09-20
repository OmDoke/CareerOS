const { spawn, execSync } = require('child_process');
const https = require('https');
require('dotenv').config();

// --- CONFIGURATION ---
const PORT = 3001; // The port your local API runs on
const VERCEL_ENV_NAME = 'CONFIG_API_URL'; // The env var to update in Vercel
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID; // Set this in your .env or system env
const VERCEL_TOKEN = process.env.VERCEL_TOKEN; // Set this in your .env or system env
const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL; // Set this in your .env to auto-deploy

// Target environments in Vercel (e.g. ['production', 'preview', 'development'])
const TARGET_ENVIRONMENTS = ['production', 'preview', 'development']; 

if (!VERCEL_PROJECT_ID || !VERCEL_TOKEN) {
  console.error('❌ Missing VERCEL_PROJECT_ID or VERCEL_TOKEN environment variables.');
  console.error('Please set them to update Vercel automatically.');
  console.error('Continuing to start cloudflared tunnel anyway...\n');
}

console.log(`🚀 Starting cloudflared tunnel on port ${PORT}...`);
const cloudflared = spawn('cloudflared', ['tunnel', '--url', `http://localhost:${PORT}`]);

let urlFound = false;

cloudflared.stderr.on('data', (data) => {
  const output = data.toString();
  process.stderr.write(output); // Print cloudflared output to terminal

  if (!urlFound) {
    // Regex to match the Cloudflare tunnel URL
    const match = output.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      const url = match[0] + '/api/v1';
      urlFound = true;
      console.log(`\n✅ Cloudflare Tunnel URL found: ${url}`);
      
      if (VERCEL_PROJECT_ID && VERCEL_TOKEN) {
        updateVercelEnv(url);
      } else {
        console.log(`⚠️ Skipping Vercel update. Please manually update ${VERCEL_ENV_NAME} to ${url} in Vercel.`);
      }
    }
  }
});

cloudflared.on('close', (code) => {
  console.log(`cloudflared exited with code ${code}`);
});

async function updateVercelEnv(url) {
  console.log(`\n🔄 Updating ${VERCEL_ENV_NAME} in Vercel project ${VERCEL_PROJECT_ID}...`);
  
  try {
    // 1. Fetch existing env vars to find the ID of the one we want to update
    const envs = await vercelApiRequest(`/v9/projects/${VERCEL_PROJECT_ID}/env`, 'GET');
    const existingEnv = envs.envs.find(e => e.key === VERCEL_ENV_NAME);

    if (existingEnv) {
      // 2. If it exists, Vercel API requires us to remove it first or edit it. 
      // Editing requires knowing its ID.
      console.log(`🗑️ Removing old ${VERCEL_ENV_NAME} (ID: ${existingEnv.id})...`);
      await vercelApiRequest(`/v9/projects/${VERCEL_PROJECT_ID}/env/${existingEnv.id}`, 'DELETE');
    }

    // 3. Create the new environment variable
    console.log(`➕ Adding new ${VERCEL_ENV_NAME}=${url}...`);
    await vercelApiRequest(`/v10/projects/${VERCEL_PROJECT_ID}/env`, 'POST', {
      key: VERCEL_ENV_NAME,
      value: url,
      type: 'plain',
      target: TARGET_ENVIRONMENTS
    });

    console.log(`🎉 Successfully updated ${VERCEL_ENV_NAME} in Vercel!`);
    
    if (VERCEL_DEPLOY_HOOK_URL) {
      console.log(`🚀 Triggering Vercel Redeployment via Deploy Hook...`);
      await fetch(VERCEL_DEPLOY_HOOK_URL, { method: 'POST' });
      console.log(`✅ Redeployment triggered successfully! Your Next.js app will be updated shortly.`);
    } else {
      console.log(`⚠️ Note: You will need to trigger a new deployment in Vercel for the Next.js app to pick up this new URL.`);
      console.log(`💡 Tip: Add a VERCEL_DEPLOY_HOOK_URL to your .env file to automate the deployment too!`);
    }

  } catch (error) {
    console.error(`❌ Failed to update Vercel: ${error.message}`);
  }
}

// Helper to make requests to Vercel API
function vercelApiRequest(path, method, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
             resolve(data ? JSON.parse(data) : null);
          } catch(e) {
             resolve(data);
          }
        } else {
          reject(new Error(`API Error ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', error => reject(error));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

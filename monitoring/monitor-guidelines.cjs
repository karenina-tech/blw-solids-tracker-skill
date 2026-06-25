'use strict';

/**
 * BLW Solids Tracker — Medical Guidelines Monitor
 *
 * This script visits each medical website listed in sources.json.
 * It saves a short "snapshot" of the page text and compares it to
 * the snapshot saved the last time the script ran.
 *
 * If a page looks different, it opens a GitHub Issue to alert you.
 * You do not need to run this manually — GitHub Actions runs it every 2 months.
 *
 * To run manually:
 *   node monitoring/monitor-guidelines.cjs
 *
 * To save new snapshots after you have reviewed a change:
 *   node monitoring/monitor-guidelines.cjs --update
 */

const https   = require('https');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');
const { URL } = require('url');

const SOURCES_PATH = path.join(__dirname, 'sources.json');
const HASHES_PATH  = path.join(__dirname, 'baseline-hashes.json');

// ─── HTTP helper ──────────────────────────────────────────────────────────────

// Downloads the content of a URL and returns it as text.
// Follows redirects automatically (websites sometimes move pages).
function get(rawUrl) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'blw-guidelines-monitor/1.0 (github-actions)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    };

    const req = https.get(options, (res) => {
      // If the server sends us to a new URL, follow it.
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        resolve(get(res.headers.location));
        return;
      }
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(body));
    });

    // Give up after 20 seconds if the website does not respond.
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error(`No response from: ${rawUrl}`));
    });
    req.on('error', reject);
  });
}

// ─── Snapshot helpers ─────────────────────────────────────────────────────────

// Creates a short fixed-length code (hash) from any text.
// If the text changes even slightly, the code will be completely different.
// This lets us detect changes without storing the full page content.
function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Removes all HTML code (tags, buttons, menus, styles) and keeps only the
// visible text. This avoids false alerts when a website redesigns its layout
// but does not change the actual medical information.
function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Source checkers ──────────────────────────────────────────────────────────

// Downloads a webpage and creates a snapshot code from its visible text.
async function checkWebpage(source) {
  const html = await get(source.url);
  const hash = sha256(extractText(html));
  return { id: source.id, hash, label: source.label };
}

// Checks a medical paper on PubMed (the official medical research database).
// PubMed is free and does not require an account or API key.
// If a correction or retraction is added to the paper, the search results
// will include a new record — and the snapshot code will change.
async function checkPubmed(source) {
  const query = encodeURIComponent(source.searchQuery);
  const searchUrl =
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
    `?db=pubmed&term=${query}&retmode=json&retmax=5`;

  const json = await get(searchUrl);
  const data = JSON.parse(json);
  const result = data.esearchresult || {};

  // Build a stable snapshot from the list of paper IDs and the total count.
  // The snapshot stays the same across runs unless PubMed changes its results.
  const ids   = (result.idlist || []).slice().sort().join(',');
  const count = result.count || '0';
  const hash  = sha256(`count=${count}::ids=${ids}`);

  return {
    id: source.id,
    hash,
    label: source.label,
    pubmedCount: count,
    pubmedIds: result.idlist || [],
  };
}

// ─── GitHub Issue creator ─────────────────────────────────────────────────────

// Opens a GitHub Issue to alert you that a source has changed.
// The issue includes simple step-by-step instructions in plain English.
function openGitHubIssue(changed) {
  const token = process.env.GITHUB_TOKEN;
  const repo  = process.env.GITHUB_REPOSITORY;

  if (!token || !repo) {
    console.warn('GITHUB_TOKEN or GITHUB_REPOSITORY not set — skipping issue creation.');
    return Promise.resolve();
  }

  const sourceList = changed.map((c) => `- **${c.label}**`).join('\n');

  const body = [
    '## ⚠️ Medical Guideline Source Change Detected',
    '',
    'Hello! This is an automatic alert from the guidelines monitoring system.',
    '',
    'The script checks the medical websites this skill relies on every 2 months.',
    'At least one of those websites looks **different from the last time** it was checked.',
    '',
    '**Which source(s) changed:**',
    sourceList,
    '',
    '---',
    '',
    '## What you need to do — step by step',
    '',
    '### Step 1 — Read the changed source',
    '',
    'Open `monitoring/sources.json` in this repository.',
    'Find the URL for each source listed above and open it in your browser.',
    '',
    'Look for any changes to:',
    '- The **minimum age** to start solid foods (currently: 6 months standard, 5 months with formula)',
    '- The **physical milestones** a baby must have (head control, sitting, grabbing)',
    '- Any new **allergen** introduction recommendations',
    '',
    '### Step 2 — Decide if the medical rules actually changed',
    '',
    'Websites sometimes update their design, navigation, or wording **without changing the medical rules**.',
    'Read carefully. If the medical information is the same as before, skip to Step 4.',
    '',
    '### Step 3 — Update the rules (only if the guidelines actually changed)',
    '',
    'Open the file `guidelines.json` in the root of this repository.',
    'Change only the values that are now outdated.',
    '',
    'Also update these two fields so you have a record of the review:',
    '- `"lastReviewed"` → today\'s date in this format: `YYYY-MM-DD` (example: `2026-08-01`)',
    '- `"version"` → increase the last number by one (example: `1.0.0` → `1.1.0`)',
    '',
    '### Step 4 — Save the new snapshots',
    '',
    'Once you are done reviewing (and updating `guidelines.json` if needed),',
    'run this command from the project root folder in your terminal:',
    '',
    '```',
    'node monitoring/monitor-guidelines.cjs --update',
    '```',
    '',
    'This will save new snapshots of the current pages into `monitoring/baseline-hashes.json`.',
    'Commit that file to the repository.',
    '',
    '### Step 5 — Close this issue',
    '',
    'Once you have committed the updated files, close this issue.',
    '',
    '---',
    '',
    '> This issue was opened automatically. No changes were made to the skill — this is only an alert.',
    '> The skill will keep working as before until you decide to update `guidelines.json`.',
  ].join('\n');

  const payload = JSON.stringify({
    title: `[Guidelines Monitor] Medical source changed — please review`,
    body,
    labels: ['guidelines-update', 'safety-review'],
  });

  return new Promise((resolve, reject) => {
    const [owner, repoName] = repo.split('/');
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${owner}/${repoName}/issues`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'User-Agent': 'blw-guidelines-monitor/1.0',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const issue = JSON.parse(data);
          if (issue.html_url) {
            console.log(`Issue opened: ${issue.html_url}`);
          } else {
            console.error('Unexpected response from GitHub API:', data);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ─── Update mode ──────────────────────────────────────────────────────────────

// Runs when you call the script with --update.
// Re-downloads all sources, creates new snapshots, and saves them.
// Use this after you have reviewed a change and are ready to accept the new version.
async function runUpdate(sources) {
  console.log('Update mode — re-saving snapshots for all sources...\n');
  const newBaseline = {};

  for (const source of sources) {
    try {
      process.stdout.write(`Saving  ${source.id} ... `);
      const result = source.type === 'pubmed'
        ? await checkPubmed(source)
        : await checkWebpage(source);
      newBaseline[result.id] = result.hash;
      console.log('done ✓');
    } catch (err) {
      console.log(`ERROR — ${err.message}`);
    }
  }

  fs.writeFileSync(HASHES_PATH, JSON.stringify(newBaseline, null, 2) + '\n');
  console.log('\nAll snapshots saved to monitoring/baseline-hashes.json');
  console.log('Commit that file to your repository to finish the update.');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { sources } = JSON.parse(fs.readFileSync(SOURCES_PATH, 'utf-8'));

  // If called with --update, save new snapshots and stop.
  if (process.argv.includes('--update')) {
    await runUpdate(sources);
    return;
  }

  const baseline = fs.existsSync(HASHES_PATH)
    ? JSON.parse(fs.readFileSync(HASHES_PATH, 'utf-8'))
    : {};

  const changed       = [];
  const newBaseline   = { ...baseline };
  let   firstRunAdded = false;

  for (const source of sources) {
    try {
      process.stdout.write(`Checking  ${source.id} ... `);
      const result = source.type === 'pubmed'
        ? await checkPubmed(source)
        : await checkWebpage(source);

      const prev = baseline[result.id];

      if (prev === undefined) {
        // This source has no saved snapshot yet — record it now without alerting.
        // This happens on the first run or when a new source is added to sources.json.
        newBaseline[result.id] = result.hash;
        firstRunAdded = true;
        console.log('NEW (snapshot saved)');
      } else if (prev !== result.hash) {
        console.log('CHANGED ⚠️');
        changed.push(result);
      } else {
        console.log('OK ✓');
      }
    } catch (err) {
      // If one source fails to load, keep going with the others.
      console.log(`ERROR — ${err.message}`);
    }
  }

  if (changed.length > 0) {
    console.log(`\n${changed.length} source(s) changed. Opening GitHub Issue...`);
    await openGitHubIssue(changed);
    // Exit with error code 1 so the GitHub Actions run shows as failed.
    // This makes the alert visible in the Actions dashboard and in email notifications.
    // The snapshots are NOT updated here — a human must review first.
    process.exit(1);
  }

  if (firstRunAdded) {
    // Save the new snapshots recorded during this run.
    fs.writeFileSync(HASHES_PATH, JSON.stringify(newBaseline, null, 2) + '\n');
    console.log('\nNew snapshots saved to monitoring/baseline-hashes.json');
  } else {
    console.log('\nAll sources match. No changes detected.');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

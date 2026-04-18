const fs = require('fs');
const path = require('path');

// Store data inside the server folder itself
const DATA_DIR  = path.join(__dirname, 'data');
const usersFile  = path.join(DATA_DIR, 'users.json');
const resultsFile = path.join(DATA_DIR, 'results.json');

// Auto-create the data directory and seed empty files if missing
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('📁 Created server/data/ directory');
  }
  if (!fs.existsSync(usersFile))   fs.writeFileSync(usersFile,   '[]', 'utf-8');
  if (!fs.existsSync(resultsFile)) fs.writeFileSync(resultsFile, '[]', 'utf-8');
}

ensureDataDir();

function readJSON(file) {
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  getUsers:    () => readJSON(usersFile),
  saveUsers:   (d) => writeJSON(usersFile, d),
  getResults:  () => readJSON(resultsFile),
  saveResults: (d) => writeJSON(resultsFile, d),
};

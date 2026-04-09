// profanity utility module: provides shared helper functions for validation and ui checks.
// keeps small reusable logic out of page-level modules.

// Simple client-side profanity checker that loads hu.txt and en.txt
let _loaded = false;
// declares mutable state used in this scope
let _banned = new Set();

// declares a helper function for a focused task
function escapeRegExp(s) {
  // returns a value from the current function
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function loadLists() {
  // checks a condition before executing this branch
  if (_loaded) return;
  // executes this operation step as part of the flow
  _loaded = true;

  // starts guarded logic to catch runtime errors
  try {
    // declares a constant used in this scope
    const paths = ["/src/locales/hu.txt", "/src/locales/en.txt"];
    // declares a constant used in this scope
    const results = await Promise.all(
      // executes this operation step as part of the flow
      paths.map((p) => fetch(p).then((r) => (r.ok ? r.text() : ""))),
    );
    // defines an arrow function used by surrounding logic
    results.forEach((txt) => {
      // defines an arrow function used by surrounding logic
      txt.split(/\r?\n/).forEach((line) => {
        // declares a constant used in this scope
        const w = line.trim().toLowerCase();
        // checks a condition before executing this branch
        if (!w) return;
        // checks a condition before executing this branch
        if (w.startsWith("#") || w.startsWith("//")) return;
        // executes this operation step as part of the flow
        _banned.add(w);
      });
    });
  } catch (err) {
    // executes this operation step as part of the flow
    console.warn("Failed to load profanity lists", err);
  }
}

export async function usernameIsProfane(username) {
  // checks a condition before executing this branch
  if (!username) return false;
  // waits for an asynchronous operation to complete
  await loadLists();
  // declares a constant used in this scope
  const s = String(username).toLowerCase().trim();

  // check exact token matches (split by non-alnum)
  const tokens = s.split(/[^a-z0-9]+/).filter(Boolean);
  // iterates through a sequence of values
  for (const t of tokens) {
    // checks a condition before executing this branch
    if (_banned.has(t)) return true;
  }

  // check substring matches for longer banned words (reduce false positives)
  for (const w of _banned) {
    // checks a condition before executing this branch
    if (w.length >= 4 && s.includes(w)) return true;
  }

  // returns a value from the current function
  return false;
}

export async function getProfanityList() {
  // waits for an asynchronous operation to complete
  await loadLists();
  // returns a value from the current function
  return Array.from(_banned);
}
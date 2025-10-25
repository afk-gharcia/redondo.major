// =========================
// loadJSON
// =========================
/**
 * Loads a JSON file from the given path using fetch.
 * @param {string} path - Path to the JSON file
 * @returns {Promise<object>} Parsed JSON object
 */
export async function loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
}

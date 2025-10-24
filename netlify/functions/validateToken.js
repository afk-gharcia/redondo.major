// Netlify Function: validateToken

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" })
    };
  }
  const { token } = body;

  // Read tokens.json from the same folder
  const fs = require('fs');
  const path = require('path');
  let validTokens = {};
  try {
    validTokens = JSON.parse(fs.readFileSync(path.join(__dirname, 'tokens.json'), 'utf8'));
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not read tokens.json" })
    };
  }

  if (token && validTokens[token]) {
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, userId: validTokens[token] })
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ valid: false, userId: 0 })
    };
  }
};

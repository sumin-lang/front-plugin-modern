export default async function handler(req, res) {
  const { inboxId } = req.query;
  const apiUrl = process.env.VITE_AIRTABLE_API_URL;
  const secret = process.env.API_SECRET_KEY;

  // ADD THESE LINES TO DEBUG
  console.log('Proxy is calling API at:', apiUrl);
  console.log('Proxy is using secret key ending with:', secret?.slice(-4));
  
  try {
    const apiResponse = await fetch(`${apiUrl}/search-by-inbox?inboxId=${inboxId}`, {
      headers: { 'Authorization': `Bearer ${secret}` }
    });

    if (!apiResponse.ok) {
      throw new Error(`API call failed with status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
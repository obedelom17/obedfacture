// Fonction serverless Vercel.
// La cle Gemini reste ICI, cote serveur, dans la variable d'environnement
// GEMINI_API_KEY (a configurer dans le dashboard Vercel : Settings > Environment Variables).
// Elle n'est jamais envoyee au navigateur.

const GEMINI_MODEL = 'gemini-2.5-flash';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Methode non autorisee, utilisez POST.' } });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: {
        message: "Variable d'environnement GEMINI_API_KEY manquante sur le serveur. " +
                  "Ajoutez-la dans Vercel : Settings > Environment Variables, puis redeployez."
      }
    });
    return;
  }

  try {
    const { parts } = req.body || {};
    if (!parts) {
      res.status(400).json({ error: { message: 'Requete invalide : champ "parts" manquant.' } });
      return;
    }

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
                GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(apiKey);

    const geminiResp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
      })
    });

    const data = await geminiResp.json();
    res.status(geminiResp.status).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e && e.message ? e.message : 'Erreur serveur inconnue.' } });
  }
}

// Fonction serverless Vercel.
// Plusieurs cles Gemini sont gardees ICI, cote serveur, dans la variable
// d'environnement GEMINI_API_KEYS (liste separee par des virgules).
// Elles ne sont jamais envoyees au navigateur.
//
// A chaque appel, on fait tourner les cles (round-robin) et, si une cle
// renvoie une erreur de quota (429), on essaie automatiquement la cle
// suivante avant d'abandonner. Ca multiplie le quota gratuit quotidien par
// le nombre de cles fournies (ex: 5 cles x 20 requetes/jour = 100/jour).

const GEMINI_MODEL = 'gemini-2.5-flash';

// Compteur en memoire : tourne tant que l'instance serverless reste "chaude".
// Redemarre a 0 sur une instance froide, ce qui est sans consequence (juste
// repart au debut de la liste de cles).
let rotationIndex = 0;

function getKeys() {
  const multi = process.env.GEMINI_API_KEYS; // ex: "cle1,cle2,cle3"
  const single = process.env.GEMINI_API_KEY;  // retro-compatibilite, une seule cle
  const raw = multi || single || '';
  return raw.split(',').map(k => k.trim()).filter(Boolean);
}

async function callGemini(apiKey, parts) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
              GEMINI_MODEL + ':generateContent?key=' + encodeURIComponent(apiKey);
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
    })
  });
  const data = await resp.json();
  return { status: resp.status, data };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Methode non autorisee, utilisez POST.' } });
    return;
  }

  const keys = getKeys();
  if (keys.length === 0) {
    res.status(500).json({
      error: {
        message: "Aucune cle API configuree sur le serveur. Ajoutez GEMINI_API_KEYS " +
                  "(une ou plusieurs cles separees par des virgules) dans Vercel : " +
                  "Settings > Environment Variables, puis redeployez."
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

    let lastResult = null;
    // On essaie chaque cle a tour de role en partant d'un point different
    // a chaque appel (rotation), pour repartir la charge entre les cles.
    for (let i = 0; i < keys.length; i++) {
      const key = keys[(rotationIndex + i) % keys.length];
      const result = await callGemini(key, parts);
      lastResult = result;
      if (result.status !== 429) {
        rotationIndex = (rotationIndex + i + 1) % keys.length;
        res.status(result.status).json(result.data);
        return;
      }
      // 429 sur cette cle : on essaie la suivante automatiquement.
    }

    // Toutes les cles ont renvoye 429 (quota atteint partout).
    rotationIndex = (rotationIndex + 1) % keys.length;
    res.status(429).json(lastResult.data);
  } catch (e) {
    res.status(500).json({ error: { message: e && e.message ? e.message : 'Erreur serveur inconnue.' } });
  }
}

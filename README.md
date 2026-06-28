# Registre de factures SYSCOHADA — version Vercel

Capture automatique de factures (photo ou PDF) avec lecture par IA (Gemini),
suggestion du compte SYSCOHADA, validation manuelle, et export CSV prêt pour
l'import dans Sage 100 i7.

## Pourquoi cette structure ?

La clé API Gemini est **gardée côté serveur** (dans `api/extract.js`, via une
variable d'environnement). Le navigateur de l'utilisateur ne voit jamais la
clé — il appelle simplement `/api/extract`, qui est une petite fonction
serverless qui relaie la demande à Gemini.

```
Navigateur (index.html)  --->  /api/extract (Vercel, garde la cle)  --->  Gemini
```

## Déploiement en 5 étapes

### 1. Obtenir une clé API Gemini (gratuite)

Allez sur **https://aistudio.google.com/app/apikey**, connectez-vous avec un
compte Google, cliquez sur **"Create API key"**, copiez la clé.

### 2. Pousser ce projet sur GitHub (ou GitLab/Bitbucket)

```bash
git init
git add .
git commit -m "Premier import du registre de factures"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

### 3. Importer le projet dans Vercel

- Allez sur **https://vercel.com**, connectez-vous
- **"Add New" > "Project"**
- Sélectionnez votre dépôt GitHub
- Vercel détecte automatiquement le dossier `api/` — **aucune configuration
  supplémentaire n'est nécessaire** (pas de build, pas de framework à choisir)

### 4. Ajouter la clé API en variable d'environnement

Avant ou après le premier déploiement :
- Dans le projet Vercel : **Settings > Environment Variables**
- Nom : `GEMINI_API_KEY`
- Valeur : la clé copiée à l'étape 1
- Cochez les 3 environnements (Production, Preview, Development)
- **Redéployez** le projet pour que la variable soit prise en compte
  (Deployments > ... > Redeploy)

### 5. Utiliser l'outil

Ouvrez l'URL fournie par Vercel (ex. `https://votre-projet.vercel.app`).
C'est prêt — glissez une facture pour tester.

## Développement local (optionnel)

```bash
npm install -g vercel
vercel dev
```

Créez un fichier `.env.local` à partir de `.env.example` avec votre vraie clé
pour tester en local.

## Limites connues

- **Quota gratuit Gemini** : environ 250 à 1500 requêtes/jour selon les
  modèles et les ajustements de Google (vérifiable sur aistudio.google.com).
  L'outil traite les factures une par une avec une pause pour rester sous la
  limite, et réessaie automatiquement en cas de blocage temporaire.
- **Confidentialité** : sur le niveau gratuit, Google peut utiliser le
  contenu envoyé pour améliorer ses modèles. Pour des données très sensibles,
  il faudra activer la facturation chez Google (n'est alors plus gratuit).
- **Stockage** : les factures validées et la mémoire des fournisseurs sont
  gardées dans le navigateur (`localStorage`) — pas de base de données
  partagée entre plusieurs ordinateurs pour l'instant.
- **Format d'export CSV** : structure générique (Date, Journal, Compte,
  Libellé, Débit, Crédit). À vérifier/adapter selon le format d'import exact
  accepté par votre version de Sage 100 i7.

## Structure du projet

```
.
├── index.html          → l'interface complète (front-end)
├── api/
│   └── extract.js      → fonction serverless qui appelle Gemini (garde la cle)
├── package.json
├── .gitignore
└── .env.example
```

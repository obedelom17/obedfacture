# ObedFacture IA — version Vercel

Capture automatique de factures (photo ou PDF) avec lecture par IA (Gemini),
suggestion du compte SYSCOHADA, validation manuelle ou en masse, et export
au format Sage 100 i7 **deja teste et valide** (modele officiel Sage).

## Pourquoi cette structure ?

La cle API Gemini est **gardee cote serveur** (dans `api/extract.js`, via une
variable d'environnement). Le navigateur de l'utilisateur ne voit jamais la
cle.

```
Navigateur (index.html)  --->  /api/extract (Vercel, garde la cle)  --->  Gemini
```

## Deploiement en 5 etapes

### 1. Obtenir une cle API Gemini (gratuite)
https://aistudio.google.com/app/apikey -> "Create API key"

### 2. Pousser ce projet sur GitHub
```bash
git init
git add .
git commit -m "Premier import"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```

### 3. Importer dans Vercel
vercel.com -> Add New -> Project -> selectionnez le depot. Aucune
configuration necessaire (le dossier `api/` est detecte automatiquement).

### 4. Ajouter la cle en variable d'environnement
Settings -> Environment Variables -> `GEMINI_API_KEY` = votre cle ->
redeployez.

### 5. Utiliser l'outil
Ouvrez l'URL Vercel fournie.

## ETAPE 0 (a faire une seule fois) : importer le plan comptable SYSCOHADA

Si votre dossier Sage est reste sur le plan comptable francais par defaut,
il faut d'abord y importer les comptes SYSCOHADA avant d'importer la
moindre facture - sinon Sage cree les comptes "a la volee" avec un mauvais
type (erreur "compte de type total").

1. Dans Sage : **Fichier -> Format import/export parametrable -> Charger**
2. Selectionnez **`Import_comptes_ObedFacture.ema`** (fourni dans ce projet)
3. **Fichier -> Importer -> Format parametrable** -> ce format ->
   selectionnez **`Comptes_SYSCOHADA_ObedFacture.txt`** (les 1091 comptes,
   deja au bon format : Compte / Intitule / Nature)
4. Verifiez dans **Structure -> Comptes generaux** que les comptes
   sont bien crees (ex: 4452, 605101, 401...)

Cette etape ne se fait qu'une seule fois par dossier comptable.

## Importer les ecritures dans Sage 100 i7 (etapes testees)

L'export produit un fichier `export_factures_sage.txt` qui suit **exactement**
la structure du modele officiel Sage "Cegid" (fichier `Exemple ecritures
Cegid.txt` fourni par Sage dans ses modeles d'importation), donc le fichier
de configuration officiel fonctionne directement.

1. Dans Sage : **Fichier -> Format import/export parametrable**
2. Cliquez **Charger** (ou Importer un format existant)
3. Selectionnez le fichier **`Import_ecritures_ObedFacture.ema`** fourni dans
   ce projet (c'est le modele officiel Sage pour ce type de structure, copie
   tel quel depuis le dossier "Modeles d'importation" de Sage)
4. Verifiez que le journal par defaut (`AC`) correspond a un code journal
   existant dans votre dossier (sinon adaptez dans Sage ou demandez-moi de
   changer le code dans l'outil)
5. **Fichier -> Importer -> Format parametrable** -> selectionnez ce format
   -> selectionnez votre fichier `.txt` exporte par ObedFacture
6. Verifiez l'ecriture creee dans **Traitement -> Consultation des ecritures**

### Structure exacte du fichier exporte
Delimiteur : tabulation · Decimales : virgule · Dates : JJ/MM/AAAA ·
Encodage : Windows-1252 (compatible Sage)

```
Jal  Date        N°    General   Auxiliaire  Reference  Debit    Credit   Date echeance  Libelle                       Mode de paiement
AC   28/06/2026  F123  605101                F123       15000,00 0,00                    Fact. fourn.  ACME - fournitures
AC   28/06/2026  F123  4452                  F123       2700,00  0,00                    Fact. fourn.  ACME - fournitures
AC   28/06/2026  F123  401                   F123       0,00     17700,00 28/06/2026     Fact. fourn.  ACME - fournitures
```

## Limites connues

- **Quota gratuit Gemini** : ~250 a 1500 requetes/jour. L'outil traite les
  factures une par une avec une pause, et reessaie automatiquement en cas de
  blocage temporaire.
- **Confidentialite** : niveau gratuit Google = le contenu peut servir a
  ameliorer leurs modeles.
- **Stockage** : factures validees et memoire fournisseurs gardees dans le
  navigateur (`localStorage`), pas de base partagee entre plusieurs PC.
- **Validation en masse** : le bouton "Valider tout" saute la verification
  manuelle - a utiliser seulement quand vous faites confiance a la lecture
  automatique (ou pour un premier tri rapide a corriger ensuite dans Sage).

## Structure du projet
```
.
├── index.html                          -> l'interface ObedFacture
├── api/extract.js                       -> fonction serverless (garde la cle)
├── Import_ecritures_ObedFacture.ema     -> format Sage pret a charger (ecritures)
├── Import_comptes_ObedFacture.ema       -> format Sage pret a charger (comptes)
├── Comptes_SYSCOHADA_ObedFacture.txt    -> les 1091 comptes SYSCOHADA a importer une fois
├── package.json
├── .gitignore
└── .env.example
```

# Correspondance Journaux ↔ Comptes SYSCOHADA (codes 8 chiffres)

A utiliser lors de la creation des codes journaux dans Sage (Structure ->
Codes journaux), champ "Compte de tresorerie" ou equivalent selon le type
de journal.

Important : ce dossier Sage utilise des comptes a 8 chiffres (complete a
droite avec des zeros, ex: 401 -> 40100000), comme le modele officiel Sage
"Cegid". Tous les fichiers et l'export d'ObedFacture IA utilisent desormais
ce format a 8 chiffres.

| Journal | Intitule                     | Compte SYSCOHADA a associer                          |
|---------|--------------------------------|---------------------------------------------------------|
| ACH     | Achats                          | (pas de compte fixe - varie selon la charge importee)   |
| VTE     | Ventes marchandises             | 70100000 (Ventes de marchandises)                        |
| BQ1     | Banque Monnaie locale - 1        | 52110000 (Banque X)                                       |
| BQ2     | Banque Monnaie locale - 2        | 52120000 (Banque Y)                                       |
| BQ3     | Banque Monnaie locale - 3        | 52130000 (creer ce sous-compte si besoin)                 |
| CAIS    | Caisse Monnaie locale            | 57110000 (Caisse siege social)                            |
| CCP     | Comptes Cheques Postaux           | 53100000 (Cheques postaux)                                |
| OD      | Operations diverses              | (pas de compte de tresorerie requis)                      |
| RAN     | Report a nouveau                 | 12100000 / 12900000 (Report a nouveau crediteur / debiteur)|

## Notes

- Le journal ACH n'a pas de compte de tresorerie fixe : chaque facture
  importee porte son propre compte de charge (60510000, 61400000, etc.),
  determine par ObedFacture IA au moment de la lecture.
- Si un journal manque (ex: une 2e caisse, un autre compte bancaire),
  creez-le dans Sage (Structure -> Codes journaux -> Nouveau) et ajoutez la
  ligne correspondante dans ce tableau pour garder une trace.
- Ces comptes doivent deja exister dans le dossier (importes via
  `Comptes_SYSCOHADA_ObedFacture.txt`, format 8 chiffres) avant de les
  associer a un journal.

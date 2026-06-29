# Correspondance Journaux ↔ Comptes SYSCOHADA

A utiliser lors de la creation des codes journaux dans Sage (Structure ->
Codes journaux), champ "Compte de tresorerie" ou equivalent selon le type
de journal.

| Journal | Intitule                     | Compte SYSCOHADA a associer                          |
|---------|-------------------------------|-------------------------------------------------------|
| ACH     | Achats                        | (pas de compte fixe - varie selon la charge importee) |
| VTE     | Ventes marchandises           | 701 (Ventes de marchandises)                          |
| BQ1     | Banque Monnaie locale - 1      | 5211 (Banque X)                                       |
| BQ2     | Banque Monnaie locale - 2      | 5212 (Banque Y)                                       |
| BQ3     | Banque Monnaie locale - 3      | 5213 (creer ce sous-compte si besoin)                 |
| CAIS    | Caisse Monnaie locale          | 5711 (Caisse siege social)                            |
| CCP     | Comptes Cheques Postaux         | 531 (Cheques postaux)                                 |
| OD      | Operations diverses            | (pas de compte de tresorerie requis)                  |
| RAN     | Report a nouveau               | 121 / 129 (Report a nouveau crediteur / debiteur)     |

## Notes

- Le journal ACH n'a pas de compte de tresorerie fixe : chaque facture
  importee porte son propre compte de charge (605x, 614, etc.), determine
  par ObedFacture au moment de la lecture.
- Si un journal manque (ex: une 2e caisse, un autre compte bancaire),
  creez-le dans Sage (Structure -> Codes journaux -> Nouveau) et ajoutez la
  ligne correspondante dans ce tableau pour garder une trace.
- Ces comptes doivent deja exister dans le dossier (importes via
  `Comptes_SYSCOHADA_ObedFacture.txt`) avant de les associer a un journal.

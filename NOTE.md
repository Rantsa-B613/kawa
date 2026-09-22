# Note — KAWA, module Réservations

## Parti pris

Faire du **créneau horaire l'unité de lecture** plutôt que la réservation individuelle, et remonter dans la liste ce qui, avant, obligeait à ouvrir chaque fiche (table non assignée, commentaire, statut du moment) — pour que la personne en salle arbitre sans clic supplémentaire.

Côté forme, j'ai choisi une **liste de cartes plutôt qu'un tableau classique** : les données d'un service (statut, arrivée, couverts) changent en continu pendant le service, ce qui se prête mieux à des lignes indépendantes qu'à une grille figée — un tableau classique aurait été plus adapté à des données stables sur la durée, ce qui n'est pas le cas ici.

Important et pas des moindres : ce site est **responsive sur tout type d'écran** — ordinateur, téléphone, tablette.

## Décisions d'ergonomie

**1. La liste en cartes ouvre plus de surface visuelle qu'un tableau.** Chaque ligne peut porter une barre de progression, une couleur liée au statut, une bordure d'état — des signaux qu'un tableau classique, contraint par ses colonnes, aurait beaucoup plus de mal à afficher clairement.

**2. Filtres muets tant qu'ils n'ont rien à dire.** Bientôt, grande tablée, tables non assignées, en attente, VIP ne se colorent que s'il y a au moins une réservation concernée, sinon ils restent en gris neutre. Le filtre horaire propose aussi "Maintenant" pour retrouver en un clic ce qui se passe dans l'heure en cours pendant le service.

**3. Réservations antérieures isolées, pas mélangées.** Une réservation dont l'heure est déjà passée bascule dans un bloc replié au-dessus de la liste (testable en créant une réservation à une heure antérieure à l'heure actuelle) — une trace légère de ce qui s'est passé, sans polluer la liste des résas à venir.

**4. La barre de progression suit un vrai événement, pas juste l'horloge.** Elle se remplit au fur et à mesure que l'heure de la réservation approche (jusqu'à 95% juste avant), mais ne passe au vert plein qu'au moment où on clique "Arrivée" — le statut passe alors en "Occupée".

**5. Alerte de doublon sur le nom ou la table.** Dans le formulaire de création, si une réservation existe déjà à moins d'une heure d'écart sous le même nom ou sur la même table, une alerte non bloquante prévient avant de valider.

## Sur le périmètre

Le brief demandait des silhouettes grises pour les autres interfaces, sans s'en préoccuper davantage. Mais une bonne structure de code commence toujours par les routes et la navigation : j'ai donc dû adapter un peu et construire des versions simples des autres écrans, avec une vraie navigation **y compris un effet de réduction de la barre de menu latérale** plutôt qu'un simple aplat gris.

## Avec deux heures de plus

Je retravaillerais le formulaire et la fiche détail pour bien séparer visuellement la section "informations client" de la section "informations réservation", pour une lecture plus rapide.

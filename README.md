localStorage-cache
==================

API de mise en cache en localStorage

## but

cet api est conçu pour des progiciel en ligne (ou applicatif web) plus que pour des site web classique.

Le but de cette api est d'accélérer le chargement des ressources et de limiter la bande passante requise pour un usage intenssif d'un même site web.

Même si elle n'a pas été conçu pour, cette api peut grandement faciliter la réalisation d'application web avec mode offline.

## fonctionnalités

- stockage local de contenu js
- stockage local de contenu css
- stockage local d'image en base64
- stockage local de chaine de caractère quelquonque
- stockage local d'objet js
- stockage spécifique selon l'utilisateur (clef d'accès) ou publique.
- information sur l'espace local disponnible restant.
- suppression de tout les contenu en cache
- suppression d'un contenu spécifique
- chargement d'un contenu js ou css (depuis la cache local si dispo, depuis le serveur sinon)
- accès à un contenu arbitraire stocké en local
- mise à jour forcé d'un contenu local depuis le serveur (conservation du contenu local en cas d'échec)
- mise à jour forcé de toute les contenu locaux public (conservation du contenu local en cas d'échec)
- accès au timestamp de mise en cache de chaque contenu (pour pouvoir gérer finement les mies à jour contenu par contenu)
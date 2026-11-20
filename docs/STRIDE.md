# Modèle de menaces STRIDE — CEEDD-STREAM (frontend)

> Périmètre : le dépôt `ceedd-stream-frontend` (Next.js 16, App Router).
> Le backend (API Django REST sur Render) est hors périmètre, mais les menaces
> qui ne peuvent être traitées que côté serveur sont listées pour l'équipe backend.
>
> Dernière mise à jour : 20 novembre 2026.

## 1. Ce qu'on protège (actifs)

| Actif | Où il se trouve | Pourquoi c'est sensible |
|---|---|---|
| Jeton JWT d'accès | `localStorage["ceeAuth-token"]` | Donne accès à toute l'API au nom de l'utilisateur |
| Profil utilisateur | `localStorage["ceedd"]` (store Zustand) | Identité affichée dans l'interface |
| Données des clients (bénéficiaires) | Réponses de l'API, cache TanStack Query | Données personnelles : nom, sexe, téléphone, e-mail, adresse |
| Données des infrastructures, inspections, bailleurs | API | Intégrité du suivi et des rapports |
| Compte Cloudinary | Preset d'upload `ceedd_upload` | Quota, réputation (contenu hébergé sous ce compte) |
| Disponibilité du site public (carte) | Hébergement Next.js | Vitrine de l'ONG et de ses partenaires |

## 2. Frontières de confiance et flux

```
 Visiteur / agent CEEDD (navigateur)
   │
   │ (1) HTTPS  pages HTML/JS ─────────────►  Serveur Next.js (layouts RSC, i18n par cookie)
   │
   │ (2) HTTPS  Axios + "Authorization: Bearer <JWT>"
   └───────────────────────────────────────►  API Django REST (app-ceedd-api.onrender.com)
   │
   │ (3) HTTPS  upload non signé (preset ceedd_upload)
   └───────────────────────────────────────►  Cloudinary (api.cloudinary.com)
   │
   │ (4) HTTPS  images, tuiles, statistiques
   └───────────────────────────────────────►  res.cloudinary.com, OpenStreetMap, ArcGIS, unpkg, Google Analytics
```

Tout ce qui s'exécute dans le navigateur est **contrôlable par l'utilisateur**
(DevTools, requêtes forgées). Une vérification faite seulement dans le frontend
améliore l'interface mais **ne protège pas les données** : c'est l'API qui doit
trancher.

## 3. Analyse STRIDE

Légende : ✅ traité dans le frontend · ⚙️ réglage à faire hors du code ·
🔙 dépend du backend · 🔲 reste à faire

### S — Spoofing (usurpation d'identité)

| Menace | Mesure | Statut |
|---|---|---|
| Vol du jeton via un script injecté (XSS), puis appels API au nom de la victime | Content-Security-Policy stricte : scripts et requêtes limités à une liste de domaines (`next.config.ts`) | ✅ |
| Session qui reste ouverte après « Déconnexion » sur un poste partagé | `clearSession()` efface jeton **et** profil (`lib/session.ts`, `services/auth.ts`) | ✅ |
| Jeton expiré encore utilisé, onglet laissé ouvert | Lecture de `exp` dans le JWT : requête annulée si expiré (intercepteur Axios), déconnexion automatique à l'échéance (`AuthGuard`) | ✅ |
| Faire croire à l'interface qu'on est connecté en modifiant `localStorage["ceedd"]` | `AuthGuard` exige aussi un jeton valide ; de toute façon l'API refuse sans vrai jeton | ✅ |
| Page de connexion affichée dans une iframe piégée (clickjacking) | `frame-ancestors 'none'` + `X-Frame-Options: DENY` | ✅ |
| Brute force sur `/api/token/` | Limiter les tentatives par IP et par compte | 🔙 |
| Jeton lisible par JavaScript (`localStorage`) | Passer à un cookie `HttpOnly; Secure; SameSite=Strict`, inaccessible au JavaScript | 🔲 (voir §5) |

### T — Tampering (falsification de données)

| Menace | Mesure | Statut |
|---|---|---|
| Saisie invalide dans les formulaires | Schémas Zod (`lib/schema.ts`) + react-hook-form | ✅ (existant) |
| Envoi de fichiers non-image ou très lourds via la page Photos | Contrôle du type (JPG/PNG/WEBP) et de la taille (5 Mo) avant envoi, `resource_type: "image"` (`components/importFiles.ts`) | ✅ |
| Contournement du contrôle ci-dessus en appelant Cloudinary directement (le preset est public) | Restreindre le preset dans la console Cloudinary : formats, taille max, dossier imposé, modération | ⚙️ |
| Requêtes API forgées à la main (contournent Zod) | Validation côté serveur (serializers DRF) | 🔙 |
| Cookie de langue modifié → chargement d'un fichier inattendu / erreur serveur | Liste blanche `fr` / `en` (`i18n/request.ts`) | ✅ |
| Dépendance npm compromise ou version différente selon la machine | Un seul lockfile (`pnpm-lock.yaml`), `package-lock.json` supprimé | ✅ |

### R — Repudiation (« ce n'est pas moi »)

| Menace | Mesure | Statut |
|---|---|---|
| Un utilisateur supprime ou modifie un client / une infrastructure et le nie | Journal d'audit côté serveur : qui, quoi, quand, ancienne valeur | 🔙 |
| Pas de traçabilité de l'auteur d'une inspection | Renseigner l'inspecteur à partir de l'utilisateur connecté côté serveur, pas d'un champ libre | 🔙 |

Le frontend ne peut pas garantir la non-répudiation : un journal tenu dans le
navigateur peut être effacé ou falsifié par l'utilisateur lui-même.

### I — Information disclosure (fuite d'informations)

| Menace | Mesure | Statut |
|---|---|---|
| Secret Cloudinary exposé dans le JavaScript public (préfixe `NEXT_PUBLIC_`) | Variable renommée `CLOUDINARY_API_SECRET`, fichier `utils/cloudinary.ts` supprimé (vérifié : absent du build) | ✅ — renommer aussi chez l'hébergeur ⚙️ |
| Mot de passe ou hash renvoyé par l'API puis copié en clair dans `localStorage` | `setUser` ne garde que `id` et `username` (`store/appStore.ts`) | ✅ |
| Fuite de l'URL interne (`Referer`) vers les sites tiers | `Referrer-Policy: strict-origin-when-cross-origin` | ✅ |
| Version du framework annoncée aux attaquants | `poweredByHeader: false` | ✅ |
| Données personnelles des bénéficiaires lisibles par un compte qui n'en a pas besoin | Permissions par rôle sur les endpoints `/clients/` | 🔙 |
| Données personnelles envoyées à Google Analytics | Aucune donnée client dans les URL ni les événements GA (à maintenir) | ✅ (à surveiller) |

### D — Denial of service (déni de service)

| Menace | Mesure | Statut |
|---|---|---|
| Faille connue de Next.js / React exploitée sur le serveur | Next `^16.4.6`, React `^19.2.6` (versions corrigées en novembre 2026) | ✅ — puis suivre les mises à jour de sécurité mensuelles de Next.js |
| Boucle infinie si l'API renvoie toujours un `next` | Plafond de 200 pages dans `getAllCustomersPages` | ✅ |
| Requêtes qui ne répondent jamais | `timeout: 30000` dans Axios | ✅ (existant) |
| Rafales de requêtes pendant la saisie de recherche | Debounce 400 ms (`useDebounce`) | ✅ (existant) |
| Saturation de l'API ou du compte Cloudinary par un script | Limitation de débit (rate limiting) et quotas | 🔙 ⚙️ |

### E — Elevation of privilege (élévation de privilèges)

| Menace | Mesure | Statut |
|---|---|---|
| Accès au dashboard sans être connecté | `AuthGuard` dans `dashboard/layout.tsx` (protège toutes les pages et la sidebar) | ✅ (protection d'interface) |
| Un « lecteur » qui crée ou supprime des données | Contrôle des rôles (`admin`, `contributeur`, `lecteur`) sur chaque endpoint d'écriture | 🔙 |
| Boutons d'administration visibles par tous les comptes | Masquer selon le rôle dès que l'API renvoie le rôle dans l'objet `user` | 🔲 |
| Exécution de code via une dépendance ou une faille XSS | CSP + `object-src 'none'` + `base-uri 'self'` + versions corrigées | ✅ |

## 4. Où se trouvent les protections dans le code

| Fichier | Rôle |
|---|---|
| `src/lib/session.ts` | Point unique pour lire, valider (expiration JWT) et effacer la session |
| `src/components/AuthGuard.tsx` | Garde du dashboard + déconnexion automatique à l'expiration |
| `src/services/api.ts` | Ajout du jeton, annulation si expiré, gestion des 401 |
| `src/store/appStore.ts` | Profil réduit à `id` + `username` |
| `src/components/importFiles.ts` | Contrôle type/taille des images avant upload |
| `src/i18n/request.ts` | Liste blanche des langues |
| `next.config.ts` | En-têtes de sécurité (CSP, anti-iframe, nosniff, referrer, permissions) |

## 5. Reste à faire

1. **Cloudinary (console)** — restreindre le preset `ceedd_upload` : formats, taille, dossier.
2. **Hébergeur** — renommer `NEXT_PUBLIC_CLOUDINARY_API_SECRET` en `CLOUDINARY_API_SECRET`.
3. **Équipe backend** — rate limiting sur `/api/token/`, permissions par rôle, validation serveur, journal d'audit, et inclure le rôle dans la réponse de connexion.
4. **Frontend, plus tard** — remplacer le stockage du jeton dans `localStorage` par un cookie `HttpOnly`. Sans toucher au backend, c'est faisable avec une route Next.js (`app/api/...`) qui relaie la connexion et pose le cookie, puis relaie les appels API (pattern « Backend for Frontend »). Changement plus lourd, à planifier.
5. **Rôles dans l'interface** — dès que l'API renvoie le rôle : masquer les actions d'écriture pour les lecteurs.

## 6. Revoir ce document quand…

- une nouvelle page ou un nouvel upload est ajouté ;
- un nouveau domaine externe est utilisé (l'ajouter aussi à la CSP dans `next.config.ts`) ;
- Next.js publie une mise à jour de sécurité (programme mensuel depuis juillet 2026).

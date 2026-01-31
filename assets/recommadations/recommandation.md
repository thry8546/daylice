# Recommandation de structure pour Daylice Café

Objectif : livrer une page unique « index.html » pour présenter le menu et une page cachée « gestion-user-8546.html » pour gérer le contenu via Supabase (auth + base de données).

## Priorité responsive
- Approche mobile-first : concevoir et tester d’abord sur smartphone, puis adapter tablette et desktop (breakpoints progressifs, grilles fluides, images adaptatives).
- Breakpoints proposés (à ajuster selon design réel) :
  - Mobile : 0–480px, une colonne, boutons pleine largeur.
  - Foldable (fermé ou écran plié) : ~481–900px, prévoir qu’un pli central peut scinder l’écran ; conserver des blocs centrés et éviter les éléments critiques au centre.
  - Tablette : ~901–1200px, deux colonnes pour le menu/promos, hero avec texte + visuel côte à côte.
  - Desktop : >1200px, grilles 3 colonnes possibles pour le menu et les promos, padding latéral accru.
- Règles clés : typographie et espacements qui s’adaptent (clamp), images responsive, nav compacte en mobile (burger), slider réactif (swipe en mobile), cartes du dashboard qui passent en grille fluide (auto-fit minmax).

## Palette
- Primaire : #87BF19
- Secondaire : #6E3C19
- Neutres : blanc et noir

## Structure de la page publique (index.html)
- **Hero / bannière** : slider avec les visuels `/asset/image/banner-img-1.jpg` à `-6.jpg`, titre + paragraphe éditables. Inclure l’avertissement allergies/intolérances.
- **Menu** : sections Chaud / Froid / Boissons alimentées par la base (prix et libellés dynamiques).
- **Plat du jour** : bloc titre + paragraphe dynamiques.
- **Promos du mois** : cartes répétables titre + paragraphe + prix promo (données dynamiques).
- **Qualité / engagement** : reprendre le texte « Qualité des produits », « Convivialité », « Terrasse », « Service take-away », horaires.
- **Contact** : adresse, téléphone, mail, liens Facebook et Telegram avec icônes dédiées. Afficher le logo `/asset/image/logo-daylice.svg`.
- **Footer** : « © 2026 Daylice Café. Tous droits réservés. »

## Page cachée de gestion (gestion-user-8546.html)
- Auth Supabase (email + password). Rediriger vers la page publique si non authentifié.
- UI simple : tableau de bord avec cartes pour chaque type de contenu.
- Éditeurs :
  - Menu chaud/froid/boissons (prix et libellés)
  - Plat du jour (titre + paragraphe)
  - Promos du mois (liste avec titre, paragraphe, prix)
  - Bannière slider (titre + paragraphe, ordre des images)
  - Contact (adresse, téléphone, mail) et liens réseaux sociaux
- Bouton « Publier » qui écrit en base (Supabase) et notifie en cas de succès/erreur.

## Schéma Supabase (SQL recommandé)
- `menus` : id, category (enum: chaud/froid/boisson), title, description, price, is_active, position.
- `daily_special` : id (singleton), title, body.
- `monthly_promos` : id, title, body, promo_price, is_active, position.
- `banners` : id, title, body, image_path, position, is_active.
- `contact` : id (singleton), address, phone, email, facebook_url, telegram_url.
- Prévoir RLS : accès public en lecture sur les tables de contenu, écriture réservée aux utilisateurs authentifiés.

## Flux de données
- La page publique lit les tables Supabase en lecture seule (fetch côté client).
- La page de gestion utilise les mutations Supabase pour mettre à jour/insérer.
- Les images référencées sont statiques (pas d’upload requis dans cette version).

## Fonctionnel attendu
- Toute modification dans le dashboard se reflète en temps réel ou après rafraîchissement sur la page publique.
- Possibilité d’ajouter/supprimer/ordonner les promos et les entrées de menu.
- Champs validés côté client (prix numériques, URLs valides, contenus non vides).

## Notes sur les CSV
- Les fichiers `/assets/csv` servent de source initiale du menu ; les convertir en INSERT SQL pour peupler `menus`.
- Ajouter au script d’amorçage des entrées par défaut pour `daily_special`, `monthly_promos` (liste vide acceptée), `banners`, `contact`.

## Accès et sécurité
- Nom de page d’admin figé : `gestion-user-8546.html`, non lié dans la navigation publique.
- Activer l’auth par email/password Supabase et forcer HTTPS en prod.
- Mettre en place des règles RLS restrictives sur les écritures, ouvertes en lecture anonyme.

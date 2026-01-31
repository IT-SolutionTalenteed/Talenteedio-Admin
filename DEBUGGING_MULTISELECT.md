# Débogage du MultiSelect avec Logos

## Problème
Les logos des companies ne s'affichent pas dans le select multiple sur la page `/event/add`.

## Changements effectués

### 1. Script selectMultiple.js amélioré
- ✅ Création d'une fonction globale `window.initializeTomSelect()`
- ✅ Collecte des logos depuis `data-logo` avant l'initialisation de TomSelect
- ✅ Stockage des logos dans un `logoMap` pour accès rapide
- ✅ Vérification que l'élément n'est pas déjà initialisé
- ✅ Auto-initialisation au chargement de la page

### 2. Composant MultiSelectInput amélioré
- ✅ Ajout d'une référence `selectElement` pour accéder au DOM
- ✅ Destruction de l'instance existante avant réinitialisation
- ✅ Appel explicite de `window.initializeTomSelect()`
- ✅ Délai de 150ms pour s'assurer que le script est chargé

### 3. Service company.service.ts
- ✅ Ajout du champ `logo { fileUrl }` dans la requête GraphQL

### 4. EventForm.vue
- ✅ Passage du logo dans le normalizer: `logo: obj.logo?.fileUrl`
- ✅ Ajout d'un console.log pour déboguer les données

## Étapes de débogage

### 1. Vérifier les données backend
Ouvrez la console du navigateur sur `/event/add` et vérifiez:
```javascript
// Devrait afficher les companies avec leurs logos
console.log('Companies data:', companies)
```

### 2. Vérifier les attributs data-logo
Dans la console, exécutez:
```javascript
document.querySelectorAll('.select-multiples option').forEach(opt => {
  console.log(opt.value, opt.getAttribute('data-logo'));
});
```

### 3. Vérifier l'initialisation de TomSelect
```javascript
const select = document.querySelector('.select-multiples');
console.log('TomSelect instance:', select?.tomselect);
```

### 4. Tester avec la page de test
Ouvrez: `http://localhost:PORT/admin/test-multiselect.html`

Cette page utilise des logos de placeholder pour tester le système.

## Solutions possibles

### Si les logos ne sont pas dans les données:
1. Vérifier que le backend retourne bien les logos
2. Vérifier la requête GraphQL dans `company.service.ts`
3. Vérifier que les companies ont bien des logos dans la base de données

### Si les attributs data-logo sont vides:
1. Vérifier le normalizer dans EventForm.vue
2. Vérifier que `obj.logo?.fileUrl` n'est pas undefined
3. Ajouter un console.log dans le normalizer:
```javascript
:normalizer="(obj: any) => {
  console.log('Normalizing:', obj.company_name, obj.logo?.fileUrl);
  return {
    label: obj.company_name,
    value: obj.id,
    logo: obj.logo?.fileUrl
  };
}"
```

### Si TomSelect ne s'initialise pas:
1. Vérifier que TomSelect est chargé: `console.log(window.TomSelect)`
2. Vérifier que le script selectMultiple.js est chargé
3. Vérifier les erreurs dans la console
4. Essayer de réinitialiser manuellement:
```javascript
window.initializeTomSelect('.select-multiples');
```

### Si les logos ne s'affichent pas malgré tout:
1. Vérifier que les URLs des logos sont valides
2. Vérifier les erreurs de chargement d'images dans l'onglet Network
3. Vérifier que le CSS est bien chargé
4. Inspecter le HTML généré par TomSelect dans les DevTools

## Commandes utiles

### Réinitialiser TomSelect manuellement
```javascript
// Dans la console du navigateur
const select = document.querySelector('.select-multiples');
if (select.tomselect) {
  select.tomselect.destroy();
}
window.initializeTomSelect('.select-multiples');
```

### Vérifier le logoMap
Ajoutez temporairement dans selectMultiple.js:
```javascript
console.log('Logo map:', logoMap);
```

### Forcer le rechargement des assets
1. Vider le cache du navigateur (Ctrl+Shift+R)
2. Vérifier que les fichiers sont bien servis:
   - `/admin/dist/js/inputs/selectMultiple.js`
   - `/admin/dist/css/inputs/selectMultiple.css`

## Fichiers modifiés

1. `Talenteedio-Admin/public/dist/js/inputs/selectMultiple.js`
2. `Talenteedio-Admin/public/dist/css/inputs/selectMultiple.css`
3. `Talenteedio-Admin/src/components/inputs/MultiSelectInput.vue`
4. `Talenteedio-Admin/src/views/dashboard-module/views/event/EventForm.vue`
5. `Talenteedio-Admin/src/views/dashboard-module/stores/services/company.service.ts`
6. `Talenteedio-Admin/src/types/window.d.ts` (nouveau)
7. `Talenteedio-Admin/public/test-multiselect.html` (nouveau)

## Prochaines étapes

Si le problème persiste après ces vérifications:
1. Vérifier les logs de la console pour des erreurs JavaScript
2. Vérifier que le serveur sert bien les fichiers statiques
3. Tester avec la page test-multiselect.html
4. Vérifier la version de TomSelect utilisée
5. Vérifier les conflits CSS potentiels

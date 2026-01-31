# Améliorations du Select Multiple

## Changements effectués

### 1. Backend - Service Company
**Fichier**: `src/views/dashboard-module/stores/services/company.service.ts`
- Ajout du champ `logo { fileUrl }` dans la requête GraphQL `getCompanies`
- Permet de récupérer les logos des companies pour l'affichage

### 2. Frontend - EventForm
**Fichier**: `src/views/dashboard-module/views/event/EventForm.vue`
- Modification du normalizer pour inclure le logo: `logo: obj.logo?.fileUrl`
- Les données du logo sont maintenant passées au composant MultiSelectInput

### 3. Composant MultiSelectInput
**Fichier**: `src/components/inputs/MultiSelectInput.vue`
- Ajout de l'attribut `data-logo` sur chaque option
- Chargement automatique du CSS personnalisé
- Support complet des logos dans les options

### 4. Script TomSelect
**Fichier**: `public/dist/js/inputs/selectMultiple.js`
- Détection automatique du mode multiple
- Ajout du plugin `remove_button` pour les sélections multiples
- Rendu personnalisé avec logos:
  - **Items sélectionnés**: Logo 24x24px avec texte
  - **Options dropdown**: Logo 32x32px avec texte en gras
- Gestion des erreurs d'image avec `onerror`
- Amélioration de l'UX avec `closeAfterSelect` et `hidePlaceholder`

### 5. Styles CSS
**Fichier**: `public/dist/css/inputs/selectMultiple.css`
- Design moderne avec dégradés
- Tags colorés avec effet hover
- Dropdown avec ombres et transitions
- Logos arrondis avec bordures
- Scrollbar personnalisée
- Responsive design
- États visuels (hover, active, selected)

## Fonctionnalités

### Sélection Multiple
- ✅ Sélection illimitée de companies
- ✅ Bouton de suppression (×) sur chaque tag
- ✅ Affichage des logos dans les tags
- ✅ Effet hover sur les tags

### Dropdown
- ✅ Logos 32x32px devant chaque nom de company
- ✅ Effet hover avec dégradé bleu
- ✅ Indication visuelle des items déjà sélectionnés
- ✅ Scrollbar personnalisée
- ✅ Hauteur max de 300px

### Design
- ✅ Dégradé violet/mauve pour les tags sélectionnés
- ✅ Bordures arrondies
- ✅ Transitions fluides
- ✅ Ombres subtiles
- ✅ Responsive

## Utilisation

Le composant fonctionne automatiquement. Pour l'utiliser avec des logos:

```vue
<MultiSelectInput
  :options="companies"
  :normalizer="(obj: any) => {
    return {
      label: obj.company_name,
      value: obj.id,
      logo: obj.logo?.fileUrl  // Important: inclure le logo
    };
  }"
  :multiple="true"
  v-model="event.companies"
  label="Select Companies"
  placeholder="Choose participating companies"
/>
```

## Notes techniques

- Les logos sont chargés depuis `data-logo` attribute
- Gestion automatique des images manquantes avec `onerror`
- Le CSS est chargé une seule fois au montage du composant
- Compatible avec TomSelect et ses plugins
- Support du mode single et multiple

## Prochaines améliorations possibles

- [ ] Recherche/filtre dans le dropdown
- [ ] Groupement par catégorie
- [ ] Lazy loading des logos
- [ ] Prévisualisation au survol
- [ ] Mode compact pour mobile

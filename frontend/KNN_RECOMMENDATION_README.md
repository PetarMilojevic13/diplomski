# 🤖 KNN Film Recommendation System

## Implementacija K-Nearest Neighbors algoritma za preporuku sličnih filmova

### 📚 Teorija

**K-Nearest Neighbors (KNN)** je supervised machine learning algoritam koji se koristi za klasifikaciju i regresiju. U našem slučaju, koristimo ga za pronalaženje najsličnijih filmova na osnovu njihovih žanrova.

### 🎯 Kako radi?

1. **Feature Extraction**: Izvlačimo karakteristike filma (žanrovi)
2. **Distance Calculation**: Računamo "rastojanje" između filmova
3. **K-Nearest Selection**: Biramo K filmova sa najmanjim rastojanjem
4. **Recommendation**: Prikazujemo te filmove kao preporuke

### 📐 Distance Metric: Jaccard Distance

Koristimo **Jaccard Distance** za merenje sličnosti između skupova žanrova:

```
Jaccard Similarity = |A ∩ B| / |A ∪ B|
Jaccard Distance = 1 - Jaccard Similarity
```

**Primer:**
- Film A: [Akcija, Triler, Sci-Fi]
- Film B: [Akcija, Avantura, Sci-Fi]

```
Presek (A ∩ B) = [Akcija, Sci-Fi] → 2 elementa
Unija (A ∪ B) = [Akcija, Triler, Sci-Fi, Avantura] → 4 elementa

Jaccard Similarity = 2 / 4 = 0.5 (50%)
Jaccard Distance = 1 - 0.5 = 0.5
```

### 🔧 Tehnička implementacija

#### Service: `recommendation.service.ts`

```typescript
getSimilarFilms(targetFilm: Film, allFilms: Film[], k: number = 5): Film[]
```

**Parametri:**
- `targetFilm`: Film za koji tražimo preporuke
- `allFilms`: Svi dostupni filmovi u bazi
- `k`: Broj preporuka (default: 5)

**Proces:**
1. Filtriramo target film iz liste
2. Računamo Jaccard Distance za svaki film
3. Sortiramo po distanci (ascending)
4. Vraćamo prvih K filmova

#### Component: `film.component.ts`

```typescript
loadSimilarFilms(): void {
  this.gostPocetnaService.getAllFilms().subscribe(allFilms => {
    this.similarFilms = this.recommendationService.getSimilarFilms(
      this.film!,
      allFilms,
      5
    );
  });
}
```

### 🎨 UI Komponente

**Sekcija preporuka:**
- Gradient pozadina (purple) za AI feel
- "AI Powered" badge
- Grid layout sa similar film cards
- Similarity percentage badge (% match)
- Hover efekat sa scale transform
- Click na karticu → navigacija na taj film

**Responsive dizajn:**
- Desktop: 5 kolona (min 200px)
- Mobile: 2 kolone (min 150px)

### 📊 Performance

**Kompleksnost:**
- Time Complexity: O(n × m)
  - n = broj filmova
  - m = prosečan broj žanrova po filmu
- Space Complexity: O(n)

**Optimizacije:**
- Koristimo Set za brže operacije preseka/unije
- Caching rezultata u komponenti
- Lazy loading preporuka (samo kada se učita film)

### 🚀 Buduća proširenja

1. **Multi-feature KNN**:
   - Dodati godinu, trajanje, prosečnu ocenu
   - Koristiti Euclidean ili Cosine Distance
   - Weighted features

2. **Collaborative Filtering**:
   - Preporuke na osnovu sličnih korisnika
   - "Korisnici koji su iznajmili ovaj film su takođe iznajmili..."

3. **Hybrid Approach**:
   - Kombinovati Content-Based (KNN) + Collaborative Filtering
   - Weighted average rezultata

4. **Advanced ML**:
   - Matrix Factorization (SVD)
   - Deep Learning (Neural Collaborative Filtering)
   - Word2Vec za opise filmova

### 📝 Primeri

**Inception (Akcija, Sci-Fi, Triler):**
- The Matrix (Akcija, Sci-Fi) → 66.7% match
- Interstellar (Avantura, Drama, Sci-Fi) → 33.3% match
- The Dark Knight (Akcija, Krimi, Drama) → 33.3% match

**The Godfather (Krimi, Drama):**
- Pulp Fiction (Krimi, Drama) → 100% match
- The Dark Knight (Akcija, Krimi, Drama) → 66.7% match
- Fight Club (Drama, Triler) → 50% match

### 🧪 Testiranje

```typescript
// Console output nakon učitavanja filma:
console.log('🤖 KNN Preporuke za film:', film.naslov);
console.log('📊 Pronađeno sličnih filmova:', similarFilms.length);
similarFilms.forEach((film, index) => {
  const similarity = getSimilarityPercentage(targetFilm, film);
  console.log(`${index + 1}. ${film.naslov} - Sličnost: ${similarity}%`);
});
```

### 📚 Reference

- [K-Nearest Neighbors Algorithm](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
- [Jaccard Index](https://en.wikipedia.org/wiki/Jaccard_index)
- [Recommender Systems](https://en.wikipedia.org/wiki/Recommender_system)

---

**Autor:** AI-Powered Diplomski Rad  
**Datum:** 2025  
**Stack:** Angular 18 + TypeScript + KNN Algorithm

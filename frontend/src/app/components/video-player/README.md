# 🎬 Video Player - Kako koristiti

## Primer upotrebe u komponenti (npr. detalji filma):

```html
<!-- film-details.component.html -->
<div class="film-details">
  <h1>{{ film.naslov }}</h1>

  <!-- Video Player komponenta -->
  <app-video-player
    [trailerUrl]="film.trailerUrl"
    [filmNaslov]="film.naslov">
  </app-video-player>

  <p>{{ film.opis }}</p>
</div>
```

```typescript
// film-details.component.ts
import { Component } from '@angular/core';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

@Component({
  selector: 'app-film-details',
  standalone: true,
  imports: [VideoPlayerComponent], // Importuj komponentu!
  templateUrl: './film-details.component.html'
})
export class FilmDetailsComponent {
  film = {
    naslov: 'Inception',
    trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0', // YouTube embed URL
    opis: 'Dom Cobb je lopov...'
  };
}
```

## Kako dobiti YouTube embed URL:

1. Idi na YouTube video (npr. Inception trailer)
2. Klikni "Share" → "Embed"
3. Kopiraj URL iz src atributa:
   ```
   https://www.youtube.com/embed/YoHD9XEInc0
   ```

## Primer podataka u bazi (MongoDB):

```javascript
{
  naslov: "Inception",
  trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
  poster: "base64_string...",
  // ostali podaci...
}
```

## Funkcionalnosti:

✅ Thumbnail sa Play dugmetom (kao IMDB)
✅ Klik → otvara fullscreen video player
✅ YouTube embed (automatski streaming)
✅ Close dugme (X)
✅ Klik van playera → zatvara se
✅ Responsive (radi na mobilnim)
✅ Animacije (fade in, slide up, pulse)

## Alternativa - Custom Video (ako imaš .mp4 fajl):

Umesto YouTube URL-a, možeš koristiti:
```html
<video controls>
  <source [src]="film.trailerUrl" type="video/mp4">
</video>
```

Ali onda moraš hostovati video na Cloudinary/AWS S3.

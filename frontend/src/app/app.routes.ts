import { Routes } from '@angular/router';
import { LoginKorisnikComponent } from './login-korisnik/login-korisnik.component';
import { RegisterKorisnikComponent } from './register-korisnik/register-korisnik.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { GostPocetnaComponent } from './gost-pocetna/gost-pocetna.component';
import { FilmComponent } from './film/film.component';
import { GlumacDetaljiComponent } from './glumac-detalji/glumac-detalji.component';
import { ReziserDetaljiComponent } from './reziser-detalji/reziser-detalji.component';
import { KorisnikPocetnaComponent } from './korisnik-pocetna/korisnik-pocetna.component';
import { KorisnikDetaljnoComponent } from './korisnik-detaljno/korisnik-detaljno.component';
import { AdminPocetnaComponent } from './admin-pocetna/admin-pocetna.component';
import { AdminEditFilmComponent } from './admin-edit-film/admin-edit-film.component';
import { AdminAddFilmComponent } from './admin-add-film/admin-add-film.component';
import { AdminRegistrationRequestsComponent } from './admin-registration-requests/admin-registration-requests.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginKorisnikComponent },
  { path: 'login-admin', component: LoginAdminComponent },
  { path: 'register', component: RegisterKorisnikComponent },
  { path: 'gost', component: GostPocetnaComponent},
  { path: 'film/:id', component: FilmComponent },
  { path: 'glumac/:ime', component: GlumacDetaljiComponent },
  { path: 'reziser/:ime', component: ReziserDetaljiComponent },
  { path: 'korisnik', component: KorisnikPocetnaComponent },
  { path: 'korisnik-detaljno', component: KorisnikDetaljnoComponent },
  { path: 'admin', component: AdminPocetnaComponent },
  { path: 'admin/add-film', component: AdminAddFilmComponent },
  { path: 'admin/edit-film/:id', component: AdminEditFilmComponent },
  { path: 'admin/registration-requests', component: AdminRegistrationRequestsComponent }
];

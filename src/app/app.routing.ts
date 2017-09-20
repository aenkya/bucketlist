import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { BucketlistComponent } from './bucketlist';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'bucketlists', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'bucketlists', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: BucketlistComponent},
    ]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const rootRouterConfig = RouterModule.forRoot(routes);

import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { BucketlistComponent } from './bucketlist';
import { BucketlistDetailComponent } from './bucketlist-detail';
import { CreateBucketlistComponent } from './create-bucketlist';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: '', redirectTo: 'bucketlists', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'bucketlists', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: BucketlistComponent},
      { path: ':id', component: BucketlistDetailComponent}
    ]
  },
  { path: 'create', component: CreateBucketlistComponent, canActivate: [AuthGuard]},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const rootRouterConfig = RouterModule.forRoot(routes);

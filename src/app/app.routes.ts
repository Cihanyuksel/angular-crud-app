import { Routes } from '@angular/router';
import { UserList } from './components/user-list/user-list';
import { UserDetailComponent } from './components/user-detail/user-detail';

export const routes: Routes = [
  { path: '', component: UserList },
  { path: 'users/:id', component: UserDetailComponent },
  { path: '**', redirectTo: '/users' },
];

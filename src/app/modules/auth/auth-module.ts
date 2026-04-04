import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { NewLogin } from './new-login/new-login';

const routes: Routes = [
  { path: '', component: NewLogin },
  { path: 'login', component: NewLogin },
];
@NgModule({
  declarations: [Login, NewLogin],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule,
    MatTabsModule
  ]
})
export class AuthModule { }

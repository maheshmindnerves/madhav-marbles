import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from './login/login';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  { path: '', component: Login },
];
@NgModule({
  declarations: [Login],
  imports: [
    CommonModule, RouterModule.forChild(routes), ReactiveFormsModule, CommonModule
  ]
})
export class AuthModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Main } from './main/main';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../guards/auth-guard';
import { Catlog } from './main/catlog/catlog';
import { About } from './main/about/about';
import { Dashboard } from './main/dashboard/dashboard';
import { ProdcutCatlog } from './main/dashboard/prodcut-catlog/prodcut-catlog';
import { AddSpecification } from './main/dashboard/add-specification/add-specification';
import { Request } from './main/request/request';
import { SalesRequest } from './main/sales-request/sales-request';
import { UserDashboard } from './main/user-dashboard/user-dashboard';
const routes: Routes = [
  {
    path: '', component: Main,
    children: [
      { path: 'catlog', component: Catlog, canActivate: [authGuard] },
      { path: 'about', component: About, canActivate: [authGuard] },
      { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
      { path: 'product-catlog', component: ProdcutCatlog, canActivate: [authGuard] },
      { path: 'specificaiton/:id/:name', component: AddSpecification, canActivate: [authGuard] },
      { path: 'request', component: Request, canActivate: [authGuard] },
      { path: 'sales-request', component: SalesRequest, canActivate: [authGuard] },
      { path: 'user-dashboard', component: UserDashboard, canActivate: [authGuard] },
      
    ],
  }
];

@NgModule({
  declarations: [Main],
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ]
})
export class MainModule { }

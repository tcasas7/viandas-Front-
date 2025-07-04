import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Pages/reset-password/reset-password.component';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./Pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./Pages/unauthorized/unauthorized.module').then( m => m.UnauthorizedPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./Pages/admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'admin-orders',
    loadChildren: () => import('./Pages/admin-orders/admin-orders.module').then( m => m.AdminOrdersPageModule)
  },
  {
    path: 'stats',
    loadChildren: () => import('./Pages/stats/stats.module').then( m => m.StatsPageModule)
  },
  {
    path: 'add-menu',
    loadChildren: () => import('./Pages/add-menu/add-menu.module').then( m => m.AddMenuPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./Pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'admin-payment-info',
    loadChildren: () => import('./Pages/admin-payment-info/admin-payment-info.module').then( m => m.AdminPaymentInfoPageModule)
  },
  {
    path: 'add-images',
    loadChildren: () => import('./Pages/add-images/add-images.module').then( m => m.AddImagesPageModule)
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
  
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

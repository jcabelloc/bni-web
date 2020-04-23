import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BaseComponent } from './components/base/base.component';
import { AdmMiembrosComponent } from './pages/adm-miembros/adm-miembros.component';


const routes: Routes = [
  { path: '', redirectTo: 'seguridad/login', pathMatch: 'full'},
  { path:'seguridad/login', component:LoginComponent},
  { path:'main', component:BaseComponent, children:[
    {path:'miembros', component: AdmMiembrosComponent}
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

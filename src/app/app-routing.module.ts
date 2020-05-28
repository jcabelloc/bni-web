import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BaseComponent } from './components/base/base.component';
import { AdmMiembrosComponent } from './pages/adm-miembros/adm-miembros.component';
import { AdmGruposComponent } from './pages/adm-grupos/adm-grupos.component';
import { AdmSesionesComponent } from './pages/adm-sesiones/adm-sesiones.component';
import { ConsultarReferenciaComponent } from './pages/consultar-referencia/consultar-referencia.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';


const routes: Routes = [
  { path: '', redirectTo: 'seguridad/login', pathMatch: 'full'},
  { path:'seguridad/login', component:LoginComponent},
  { path:'main', component:BaseComponent, children:[
    {path:'usuarios', component: AdmUsuariosComponent},
    {path:'miembros', component: AdmMiembrosComponent},
    {path:'grupos', component: AdmGruposComponent },
    {path:'sesiones', component: AdmSesionesComponent },
    {path:'referencias', component: ConsultarReferenciaComponent }
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

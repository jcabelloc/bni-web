import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { BaseComponent } from './components/base/base.component';
import { AdmMiembrosComponent } from './pages/adm-miembros/adm-miembros.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SaveMiembroComponent } from './dialog/save-miembro/save-miembro.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { AgmCoreModule } from '@agm/core';
import {MatPaginatorModule} from '@angular/material/paginator';

import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AdmGruposComponent } from './pages/adm-grupos/adm-grupos.component';
import { SaveGrupoComponent } from './dialog/save-grupo/save-grupo.component';
import { AdmSesionesComponent } from './pages/adm-sesiones/adm-sesiones.component';
import { GenerarSesionesComponent } from './dialog/generar-sesiones/generar-sesiones.component';
import { EditSesionComponent } from './dialog/edit-sesion/edit-sesion.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ConsultarReferenciaComponent } from './pages/consultar-referencia/consultar-referencia.component';
import { AuthenticationService } from './services/authentication.service';
import { DeleteMiembroComponent } from './dialog/delete-miembro/delete-miembro.component';
import { DeleteGrupoComponent } from './dialog/delete-grupo/delete-grupo.component';
import { AdmUsuariosComponent } from './pages/adm-usuarios/adm-usuarios.component';
import { SaveUsuarioComponent } from './dialog/save-usuario/save-usuario.component';
import { BuscarMiembroComponent } from './dialog/buscar-miembro/buscar-miembro.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent,
    AdmMiembrosComponent,
    SaveMiembroComponent,
    AdmGruposComponent,
    SaveGrupoComponent,
    AdmSesionesComponent,
    GenerarSesionesComponent,
    EditSesionComponent,
    ConsultarReferenciaComponent,
    DeleteMiembroComponent,
    DeleteGrupoComponent,
    AdmUsuariosComponent,
    SaveUsuarioComponent,
    BuscarMiembroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AgmCoreModule.forRoot({apiKey: environment.apiKey}),
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: (authService: AuthenticationService) => () => authService.initializeUsuario(),
    deps: [AuthenticationService],
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

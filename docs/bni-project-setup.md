# Configuracion del Proyecto Web BNI

### Creacion del proyecto BNI con Angular y Angular Material 
```bash
ng new bni-web --style scss --routing
cd bni-web
ng add @angular/material
```


### Crear Proyecto Firebase
* Crear proyecto "bni-dev" usando cuenta jcabelloc@itana.pe, pasos por default.

### Agregar Firebase a nuestro proyecto web en la consola Firebase
* app nickname: Dev BNI web
* Also set up Firebase hosting: bni-dev
* -> REGISTER APP

### Login a Firebase desde consola
* Desde el git bash, ingresar como jcabelloc@itana.pe
```bash
firebase logout
firebase login
? Allow Firebase to collect CLI usage and error reporting information? Yes
```

## Install AngularFire and Firebase
```bash

ng add @angular/fire@next

? Please select a project: bni-dev (bni-dev)

npm install firebase --save
```

## Add Firebase config to environments variable
```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>'
  }
};
```


### Creacion de la base de datos en Firebase console
* Cloud Firestore / Multi region / nam5 (us-central)
* mode: Test Mode


### Habilitacion del Firebase storage
* Firestore /Storage 
* Permission:     allow read, write: if request.time < timestamp.date(2020, 5, 23);

## Install Angular Google Maps (AGM)
```bash
npm install @agm/core --save
```

### Get API KEY

https://developers.google.com/maps/documentation/javascript/get-api-key?hl=es-419

### Import and add AgmCoreModule to AppModule
```bash
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
```


### Agregar Firebase Functions
* Referencia: https://firebase.google.com/docs/functions/get-started
* Ejecutar el comando: firebase init functions

```bash
$ firebase init functions

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  C:\jcabelloc\workspace\iTana\7.bni\bni-web\bni-web

Before we get started, keep in mind:

  * You are currently outside your home directory
  * You are initializing in an existing Firebase project directory

? Are you ready to proceed? Yes

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add,
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: bni-dev (bni-dev)
i  Using project bni-dev (bni-dev)

=== Functions Setup

A functions directory will be created in your project with a Node.js
package pre-configured. Functions can be deployed with firebase deploy.

? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use TSLint to catch probable bugs and enforce style? Yes
+  Wrote functions/package.json
+  Wrote functions/tslint.json
+  Wrote functions/tsconfig.json
+  Wrote functions/src/index.ts
+  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? Yes

> protobufjs@6.9.0 postinstall C:\jcabelloc\workspace\iTana\7.bni\bni-web\bni-web\functions\node_modules\protobufjs
> node scripts/postinstall

npm notice created a lockfile as package-lock.json. You should commit this file.
added 292 packages from 221 contributors and audited 292 packages in 14.209s

32 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities


i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

+  Firebase initialization complete!

jcabelloc@DESKTOP-J7LQIC5 MINGW64 /c/jcabelloc/workspace/iTana/7.bni/bni-web/bni-web (master)
```

### Agregar funciones en Firebase que sean ejecutadas por eventos
* https://firebase.google.com/docs/functions/firestore-events
* https://firebase.google.com/docs/reference/admin
* https://googleapis.dev/nodejs/firestore/latest/
* https://firebase.google.com/docs/firestore/manage-data/add-data#web
 
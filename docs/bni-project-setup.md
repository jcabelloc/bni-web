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
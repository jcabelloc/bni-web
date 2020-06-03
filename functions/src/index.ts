import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

export const updateUsuarioOnUpdateMiembro = functions.firestore
    .document('miembros/{idMiembro}')
    .onUpdate((change, context) => {
        const updatedMiembro = change.after.data();
        db.collection('usuarios').where('idMiembro', '==', context.params.idMiembro).get()
            .then((querySnapshot: any[]) => {
                querySnapshot.forEach(documentSnapshot => {
                    // documentSnapshot.ref.path referencia a: usuarios/{usuarioId}
                    db.doc(documentSnapshot.ref.path).set({
                        nombres: updatedMiembro?.nombres,
                        apellidos: updatedMiembro?.apellidos,
                        avatarUrl: updatedMiembro?.avatarUrl
                    }, { merge: true });
                });
            });
        return 0;
    });

export const createUser = functions.firestore
    .document('usuarios/{usuarioId}')
    .onCreate(async (snap, context) => {
        const userId = context.params.usuarioId;
        const Usuario = snap.data();
        await admin.auth().createUser({
            disabled: false,
            displayName: Usuario?.nombres,
            email: Usuario?.email,
            password: Usuario?.passwordInicial,
            uid: userId
        });
        db.doc(snap.ref.path).set({
            nombres: Usuario.nombres,
            apellidos: Usuario.apellidos,
            email: Usuario.email,
            idMiembro: Usuario.isMiembro,
            esAdmin: Usuario.esAdmin,
            passwordInicial: "",
        }, { merge: true });
        return 0;
    });
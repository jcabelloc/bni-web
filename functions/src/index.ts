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

export const createFirebaseUserOnCreateUsuario = functions.firestore
    .document('usuarios/{usuarioId}')
    .onCreate(async (snap, context) => {
        const userId = context.params.usuarioId;
        const usuario = snap.data();
        admin.auth().createUser({
            disabled: false,
            displayName: usuario?.nombres,
            email: usuario?.email,
            password: usuario?.passwordInicial,
            uid: userId
        }).then(
            db.collection('usuarios').doc(userId).update({
                passwordInicial: "",
            }, { merge: true })
        );
        return 0;
    });

export const updateFirebaseUserOnUpdateUsuario = functions.firestore
    .document('usuarios/{usuarioId}')
    .onUpdate((change, context) => {
        
        const userId = context.params.usuarioId;
        const usuario = change.after.data();

        let passwordUsuarioFirebase: string;

        admin.auth().getUser(userId).then(function(userRecord: any) {
            passwordUsuarioFirebase = userRecord.password;
            admin.auth().updateUser(userId, {
                disabled: !usuario?.estaActivo,
                displayName: usuario?.nombres,
                email: usuario?.email,
                password: usuario?.passwordInicial !== "" ? usuario?.passwordInicial :passwordUsuarioFirebase
            }).then(db.collection('usuarios').doc(userId).update({
                passwordInicial: "",
            }, { merge: true }));
        })
        return 0;
    });

export const updateMiembroOnUpdateUsuario = functions.firestore
    .document('usuarios/{idUsuario}')
    .onUpdate((change, context) => {
        const updatedUsuario = change.after.data();
        db.collection('miembros').doc(updatedUsuario?.idMiembro).update({
            nombres: updatedUsuario?.nombres,
            apellidos: updatedUsuario?.apellidos,
            avatarUrl: updatedUsuario?.avatarUrl,
            email: updatedUsuario?.email
        }, { merge: true });
        return 0;
    });
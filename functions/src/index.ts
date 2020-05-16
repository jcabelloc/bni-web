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

export class Usuario {
    uid: string;
    nombres: string;
    apellidos: string;
    email: string;
    idMiembro: string;
    esAdmin: boolean;
    avatarUrl: string;
    public static readonly defaultAvatar = "default-avatar.png";
}

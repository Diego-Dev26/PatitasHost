import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    nombres: {
      type: String,
      required: true,
      uppercase: true,
      maxLength: 50,
    },
    primerApellido: {
      type: String,
      required: true,
      uppercase: true,
      maxLength: 50,
    },
    segundoApellido: {
      type: String,
      uppercase: true,
      maxLength: 50,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      minLength: 4,
      maxLength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxLength: 80,
    },
    celular: {
      type: String,
      required: true,
      maxLength: 15,
    },
    direccion: {
      type: String,
      required: true,
      maxLength: 200,
    },
    password: {
      type: String,
      required: true,
    },
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    photo_url: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    last_login: {
      type: Date,
      default: null,
    },
    last_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, //createdAt updatedAt automatic
    methods: {
      //solo para el documento
      async get_all_permissions(id = null) {
        const permissions = [];
        var user = null;
        if (id) {
          user = model("User").findById(id);
        } else {
          user = this;
        }
        user = await user.populate([
          {
            path: "groups",
            select: "permissions",
            populate: {
              path: "permissions",
              select: "codename",
            },
          },
          {
            path: "permissions",
            select: "codename",
          },
        ]);
        user.groups.forEach((element) => {
          element.permissions.forEach((element2) => {
            if (!permissions.includes(element2.codename))
              permissions.push(element2.codename);
          });
        });
        user.permissions.forEach((element) => {
          if (!permissions.includes(element.codename))
            permissions.push(element.codename);
        });
        return permissions;
      },
    },
    statics: {
      //para todo el modelo
    },
    query: {
      //para odenar o hacer consultas especiales
    },
  }
);
export default model("User", userSchema);

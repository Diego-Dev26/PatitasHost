import { Schema, model } from "mongoose";

const adopcionSchema = new Schema(
  {
    //initJSid_mascota
    id_mascota: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Mascota",
    },

    //endJSid_mascota
    //initJSid_usuario
    id_usuario: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    //endJSid_usuario
    //initJSdescripcion
    descripcion: {
      type: Schema.Types.String,
      trim: true,
    },

    //endJSdescripcion
    //fields
    last_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, //createdAt updatedAt automatic
    methods: {
      //solo para el documento
    },
    statics: {
      //para todo el modelo
    },
    query: {
      //para odenar o hacer consultas especiales
    },
  }
);
export default model("Adopcion", adopcionSchema);

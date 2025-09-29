import { Schema, model } from "mongoose";

const denunciaSchema = new Schema(
  {
    //initJSid_usuario
    id_usuario: {
      type: Schema.Types.ObjectId,
      required: true,

      ref: "User",
    },

    //endJSid_usuario
    //initJStipo_denuncia
    tipo_denuncia: {
      type: Schema.Types.String,
      required: true,

      default: "Datos Incorrectos",

      trim: true,
    },

    //endJStipo_denuncia
    //initJSdescripcion
    descripcion: {
      type: Schema.Types.String,

      trim: true,
    },

    //endJSdescripcion
    //initJSestado
    estado: {
      type: Schema.Types.String,

      default: "Pendiente",

      trim: true,
    },

    //endJSestado
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
export default model("Denuncia", denunciaSchema);

import { Schema, model } from "mongoose";

const historialSchema = new Schema(
  {
    //initJSid_mascota
    id_mascota: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Mascota",
    },

    //endJSid_mascota
    //initJSesterilizacion
    esterilizacion: {
      type: Schema.Types.Boolean,
      default: false,
    },

    //endJSesterilizacion
    //initJSvacunas
    vacunas: {
      type: Schema.Types.String,
      trim: true,
    },

    //endJSvacunas
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
export default model("Historial", historialSchema);

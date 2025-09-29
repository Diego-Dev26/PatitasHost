import { Schema, model } from "mongoose";

const mascotaSchema = new Schema(
  {
    //initJSnombre
    nombre: {
      type: Schema.Types.String,
      required: true,

      trim: true,
    },

    //endJSnombre
    //initJSespecie
    especie: {
      type: Schema.Types.String,
      required: true,

      trim: true,
    },

    //endJSespecie
    //initJSraza
    raza: {
      type: Schema.Types.String,
      required: true,

      trim: true,
    },

    //endJSraza
    //initJSgenero
    genero: {
      type: Schema.Types.String,

      default: "Macho",

      trim: true,
    },

    //endJSgenero
    //initJSfecha_nacimiento
    fecha_nacimiento: {
      type: Schema.Types.Date,
      required: true,
    },

    //endJSfecha_nacimiento
    //initJSaltura
    altura: {
      type: Schema.Types.Number,
      required: true,
    },

    //endJSaltura
    //initJSpeso
    peso: {
      type: Schema.Types.Number,
      required: true,
    },

    //endJSpeso
    //initJSdescripcion
    descripcion: {
      type: Schema.Types.String,
      required: true,

      trim: true,
    },

    //endJSdescripcion
    //initJSimagen
    imagen: [
      {
        type: Schema.Types.Mixed,
      },
    ],

    //endJSimagen
    //initJSalimentacion
    alimentacion: {
      type: Schema.Types.String,
      required: true,

      trim: true,
    },

    //endJSalimentacion
    //initJSestado_salud
    estado_salud: {
      type: Schema.Types.String,

      trim: true,
    },

    //endJSestado_salud
    //initJSdisponibilidad
    disponibilidad: {
      type: Schema.Types.Boolean,
      default: false,
    },

    //endJSdisponibilidad
    //fields
    last_user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    create_by: {
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
export default model("Mascota", mascotaSchema);

import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
    },
    codename: {
      type: Schema.Types.String,
    },
    number: {
      type: Schema.Types.Number,
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
export default model("Permission", permissionSchema);

import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      uppercase: true,
      maxLength: 50,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
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
export default model("Group", groupSchema);

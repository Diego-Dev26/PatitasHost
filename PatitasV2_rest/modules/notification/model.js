import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    message: {
      type: Schema.Types.String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isGlobal: {
      type: Schema.Types.Boolean,
      default: false,
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
export default model("Notification", notificationSchema);

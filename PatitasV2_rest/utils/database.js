import { connect } from "mongoose";
import { Schema, model } from "mongoose";

const seqSchema = new Schema({
  name: Schema.Types.String,
  value: {
    type: Schema.Types.Number,
    default: 0,
  },
});
const Seq = model("Seq", seqSchema);

export async function connectDB() {
  const mongo_url =
    process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test"
      ? process.env.MONGODB_URI_ATLAS
      : process.env.MONGODB_URI;
  try {
    await connect(mongo_url, {
      dbName: process.env.DATABASE_NAME,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

export async function autoIncrement(name) {
  const seq = await Seq.findOneAndUpdate(
    { name },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return seq.value;
}

export function getQueryDate({ value, value_condition }) {
  const timestamp = Date.parse(value);
  if (!isNaN(timestamp)) {
    const date = new Date(timestamp);
    let query =
      value_condition === "equal"
        ? { $eq: date }
        : value_condition === "greater"
        ? { $gt: date }
        : value_condition === "less"
        ? { $lt: date }
        : value_condition === "greaterOrEqual"
        ? { $gte: date }
        : value_condition === "lessOrEqual"
        ? { $lte: date }
        : { $eq: new Date(value) };
    return query;
  }
  return false;
}

export function getQueryNumber({ value, value_condition }) {
  const number = parseFloat(value);
  if (!isNaN(number)) {
    let query =
      value_condition === "equal"
        ? { $eq: number }
        : value_condition === "greater"
        ? { $gt: number }
        : value_condition === "less"
        ? { $lt: number }
        : value_condition === "greaterOrEqual"
        ? { $gte: number }
        : value_condition === "lessOrEqual"
        ? { $lte: number }
        : { $eq: number };
    return query;
  }
  return false;
}

export function convertToOr(query) {
  let newQuery = { $or: [] };
  for (const [key, value] of Object.entries(query)) {
    if (key != "all") {
      let fieldQuery = {};
      fieldQuery[key] = value;
      newQuery.$or.push(fieldQuery);
    }
  }
  return newQuery;
}

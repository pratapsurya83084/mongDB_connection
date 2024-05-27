import mongoose, { Schema } from "mongoose";
//aggregation pipelined
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const vidioSchema = new Schema(
  {
    vidioFile: {
      type: String, //url throught
      required: true,
    },
    thumnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, //url throught
      required: true,
    },
     views:{
      type:Number,
      default:0
     },
     publish:{
      type:Boolean,
      default:true
     },
     vidioowener:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
     }
  
  },
  { timestamps: true },
);

vidioSchema.plugin(mongooseAggregatePaginate)

export const Vidio = mongoose.model("Vidio", vidioSchema);

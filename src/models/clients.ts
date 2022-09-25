// client schema

import { Document, model, Mongoose, Schema } from "mongoose";

// mongose type

export interface ClientSchema extends Document {
  name: string;
  description: string;
}

export const ClientSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
}).set("versionKey", false);

export const Client = model<ClientSchema>("Client", ClientSchema);

// routes schema
export interface RoutesSchema extends Document {
  name: string;
  description: string;
}

export const RoutesSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
}).set("versionKey", false);

export const Routes = model<RoutesSchema>("Routes", RoutesSchema);

// places schema
export interface PlacesSchema extends Document {
  name: string;
  description: string;
  client: ClientSchema;
  route: RoutesSchema;
  vehicle: VehicleSchema;
  driver: UserSchema;
  longitude: number;
  latitude: number;
  imageUrl: string;
}

export const PlacesSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },

  // driver
  driver: { type: Schema.Types.ObjectId, ref: "Drivers" },
  // vehicle
  vehicle: { type: Schema.Types.ObjectId, ref: "Vehicles" },

  time: { type: Date, default: Date.now },
  route: { type: Schema.Types.ObjectId, ref: "Routes" },
  client: { type: Schema.Types.ObjectId, ref: "Client" },
  // vehicle: { type: Schema.Types.ObjectId, ref: "Vehicles" },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  imageUrl: { type: String, required: false },
}).set("versionKey", false);

export const Places = model<PlacesSchema>("Places", PlacesSchema);

// userName password and DNI
export interface UserSchema extends Document {
  userName: string;
  password: string;
  DNI: string;
}

export const UserSchema = new Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  DNI: { type: String, required: true },
  // clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  // vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle" },
}).set("versionKey", false);

export const Driver = model<UserSchema>("Drivers", UserSchema);

// vehicle schema
export interface VehicleSchema extends Document {
  name: string;
  driver: UserSchema;
}

export const VehicleSchema = new Schema({
  name: { type: String, required: true },
}).set("versionKey", false);

export const Vehicle = model<VehicleSchema>("Vehicles", VehicleSchema);

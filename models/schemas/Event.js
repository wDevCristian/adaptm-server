import sequelize from "../../db.js";
import { DataTypes } from "sequelize";

const Event = sequelize.define("event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING(80),
    allowNull: false,
    validate: {
      max: 80,
    },
  },
  description: {
    type: DataTypes.STRING(3000),
    allowNull: false,
    validate: {
      max: 3000,
    },
  },
  maxNrOfParticipants: {
    type: DataTypes.INTEGER,
  },
  startDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
  building: {
    type: DataTypes.STRING,
  },
  addressNr: {
    type: DataTypes.STRING,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
});

export default Event;

import sequelize from "../../db.js";
import { DataTypes } from "sequelize";

const EventType = sequelize.define("event_type", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default EventType;

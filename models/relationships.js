import User from "./schemas/User.js";
import Event from "./schemas/Event.js";
import EventType from "./schemas/EventType.js";

User.hasMany(Event, {
  foreignKey: {
    name: "organizerId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Event.belongsTo(User, {
  foreignKey: {
    name: "organizerId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Event.hasMany(EventType, {
  foreignKey: {
    name: "eventId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
EventType.belongsTo(Event, {
  foreignKey: {
    name: "eventId",
    allowNull: false,
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// For many-to-many relations and a new table creation
// EventType.belongsToMany(Event, {
//   through: "event_is_a_event_type",
//   foreignKey: {
//     name: "eventTypeId",
//   },
// });
// Event.belongsToMany(EventType, {
//   through: "event_is_a_event_type",
//   foreignKey: {
//     name: "eventId",
//   },
// });

User.belongsToMany(Event, {
  through: "user_participate_event",
  foreignKey: {
    name: "userId",
  },
});
Event.belongsToMany(User, {
  through: "user_participate_event",
  foreignKey: {
    name: "eventId",
  },
});

User.belongsToMany(Event, {
  through: "user_save_event",
  foreignKey: {
    name: "userId",
  },
});
Event.belongsToMany(User, {
  through: "user_save_event",
  foreignKey: {
    name: "eventId",
  },
});

export { Event, User, EventType };

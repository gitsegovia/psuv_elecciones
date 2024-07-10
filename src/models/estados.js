import { Model, STRING, INTEGER } from "sequelize";

const createModel = (sequelize) => {
  class Estado extends Model {
    static associate(models) {
      Estado.hasMany(models.Municipio, {
        foreignKey: {
          name: "cod_edo",
          field: "cod_edo",
        },
        as: "Municipio",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Estado.init(
    {
      cod_edo: {
        primaryKey: true,
        allowNull: false,
        type: INTEGER,
        defaultValue: 0,
      },
      nombre: {
        allowNull: false,
        type: STRING,
      },
    },
    {
      sequelize,
      modelName: "Estado",
    }
  );
  return Estado;
};

export default createModel;

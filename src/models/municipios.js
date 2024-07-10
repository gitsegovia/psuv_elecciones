import { Model, STRING, INTEGER } from "sequelize";

const createModel = (sequelize) => {
  class Municipio extends Model {
    static associate(models) {
      Municipio.hasMany(models.Parroquia, {
        foreignKey: {
          name: "cod_mun",
          field: "cod_mun",
        },
        as: "Parroquia",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Municipio.init(
    {
      cod_mun: {
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
      modelName: "Municipio",
    }
  );
  return Municipio;
};

export default createModel;

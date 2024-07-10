import { Model, STRING, INTEGER } from "sequelize";

const createModel = (sequelize) => {
  class Parroquia extends Model {
    static associate(models) {
      Parroquia.hasMany(models.CentroVotacion, {
        foreignKey: {
          name: "cod_par",
          field: "cod_par",
        },
        as: "CentroVotacion",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Parroquia.init(
    {
      cod_par: {
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
      modelName: "Parroquia",
    }
  );
  return Parroquia;
};

export default createModel;

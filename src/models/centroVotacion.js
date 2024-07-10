import { Model, STRING, TEXT, INTEGER, DATE } from "sequelize";
import { makeid } from "../utils/security";

const createModel = (sequelize) => {
  class CentroVotacion extends Model {
    static associate(models) {
      CentroVotacion.hasMany(models.Mesa, {
        foreignKey: {
          name: "ctro_prop",
          field: "ctro_prop",
        },
        as: "Mesa",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      CentroVotacion.hasMany(models.ReporteVotacion, {
        foreignKey: {
          name: "ctro_prop",
          field: "ctro_prop",
        },
        as: "ReporteVotacion",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      CentroVotacion.belongsTo(models.Parroquia, {
        foreignKey: {
          name: "cod_par",
          field: "cod_par",
        },
        as: "Parroquia",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  CentroVotacion.init(
    {
      ctro_prop: {
        primaryKey: true,
        allowNull: false,
        type: INTEGER,
        defaultValue: 0,
      },
      nombre: {
        allowNull: false,
        type: STRING,
      },
      direccion: {
        allowNull: false,
        type: TEXT,
      },
      apertura: {
        allowNull: true,
        type: DATE,
      },
      cierre: {
        allowNull: true,
        type: DATE,
      },
      obs_apertura: {
        allowNull: false,
        type: TEXT,
        defaultValue: "",
      },
      obs_cierre: {
        allowNull: false,
        type: TEXT,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "CentroVotacion",
    }
  );
  return CentroVotacion;
};

export default createModel;

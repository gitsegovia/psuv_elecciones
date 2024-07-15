import { Model, STRING, TEXT, INTEGER, DATE, UUID, UUIDV4 } from "sequelize";
import { makeid } from "../utils/security";

const createModel = (sequelize) => {
  class Mesa extends Model {
    static associate(models) {
      Mesa.hasMany(models.ReporteVotacion, {
        foreignKey: {
          name: "mesaId",
          field: "mesaId",
        },
        as: "ReporteVotacion",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      Mesa.belongsTo(models.CentroVotacion, {
        foreignKey: {
          name: "ctro_prop",
          field: "ctro_prop",
        },
        as: "CentroVotacion",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Mesa.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4,
      },
      cod_mesa: {
        allowNull: false,
        type: INTEGER,
      },
      electores: {
        allowNull: false,
        type: INTEGER,
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
      modelName: "Mesa",
    }
  );
  return Mesa;
};

export default createModel;

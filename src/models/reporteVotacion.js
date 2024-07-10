import { Model, INTEGER, DATE, UUID, UUIDV4 } from "sequelize";

const createModel = (sequelize) => {
  class ReporteVotacion extends Model {
    static associate(models) {
      ReporteVotacion.belongsTo(models.CentroVotacion, {
        foreignKey: {
          name: "ctro_prop",
          field: "ctro_prop",
        },
        as: "CentroVotacion",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      ReporteVotacion.belongsTo(models.Mesa, {
        foreignKey: {
          name: "mesaId",
          field: "mesaId",
        },
        as: "Mesa",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ReporteVotacion.init(
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4,
      },
      a_favor: {
        allowNull: false,
        type: INTEGER,
      },
      en_contra: {
        allowNull: true,
        type: INTEGER,
      },
      en_cola: {
        allowNull: true,
        type: INTEGER,
      },
      en_duda: {
        allowNull: true,
        type: INTEGER,
      },
    },
    {
      sequelize,
      modelName: "ReporteVotacion",
    }
  );
  return ReporteVotacion;
};

export default createModel;

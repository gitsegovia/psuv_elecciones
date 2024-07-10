import moment from "moment";
import { encrypt } from "../../utils/security";
import { Op } from "sequelize";

export default {
  Query: {},
  Mutation: {
    setVotacion: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const findReport = await models.ReporteVotacion.findOne({
            where: {
              ctro_prop: input.ctro_prop,
              mesaId: input.mesaId,
            },
            order: [["createdAt", "DESC"]],
          });

          if (findReport) {
            if (input.a_favor < findReport.a_favor) {
              throw new Error(
                "Cantidad a favor no puede ser menor a la reportada"
              );
            }
            if (input.en_contra < findReport.en_contra) {
              throw new Error(
                "Cantidad en contra no puede ser menor a la reportada"
              );
            }
            if (input.en_duda < findReport.en_duda) {
              throw new Error(
                "Cantidad en duda no puede ser menor a la reportada"
              );
            }
          }
          await models.ReporteVotacion.create({ ...input });

          return true;
        });

        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

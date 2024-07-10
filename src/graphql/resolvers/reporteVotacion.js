import moment from "moment";
import { encrypt } from "../../utils/security";
import { Op } from "sequelize";

export default {
  Query: {},
  Mutation: {
    setVotacion: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
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

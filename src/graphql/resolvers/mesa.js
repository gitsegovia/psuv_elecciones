import moment from "moment";
import { encrypt } from "../../utils/security";

export default {
  Query: {
    getMesasAll: async (_, { search }, { models }) => {
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        include: [
          {
            model: models.ReporteVotacion,
            as: "ReporteVotacion",
          },
        ],
      };

      if (options !== null) {
        if (options.limit > 0) {
          optionsFind.limit = options.limit;
        }
        if (options.offset > 0) {
          optionsFind.offset = options.offset;
        }
        if (options.orderBy) {
          optionsFind.order = options.orderBy.map((field, index) => {
            return [
              field,
              options.direction ? options.direction[index] ?? "ASC" : "ASC",
            ];
          });
          optionsFind.include.order = optionsFind.order;
        }
      }

      const listMesa = await models.Mesa.findAll(optionsFind);

      const infoPage = {
        count: listMesa.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listMesa,
      };
    },
    getMesasByCentroVotacion: async (_, { search, ctro_prop }, { models }) => {
      if (!ctro_prop) {
        throw new Error("Falta el código del centro de votación");
      }
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        where: {
          ctro_prop,
        },
        include: [
          {
            model: models.ReporteVotacion,
            as: "ReporteVotacion",
          },
        ],
        order: [["cod_mesa", "ASC"]],
      };

      if (options !== null) {
        if (options.limit > 0) {
          optionsFind.limit = options.limit;
        }
        if (options.offset > 0) {
          optionsFind.offset = options.offset;
        }
        if (options.orderBy) {
          optionsFind.order = options.orderBy.map((field, index) => {
            return [
              field,
              options.direction ? options.direction[index] ?? "ASC" : "ASC",
            ];
          });
          optionsFind.include.order = optionsFind.order;
        }
      }

      const listMesa = await models.Mesa.findAll(optionsFind);

      const infoPage = {
        count: listMesa.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listMesa,
      };
    },
  },
  Mutation: {
    aperturaMesa: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const upd = {
            apertura: input.apertura,
            obs_apertura: input.obs_apertura,
          };
          await models.Mesa.update(
            { ...upd },
            {
              where: {
                id: input.id,
              },
            }
          );

          return true;
        });

        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
    cierreMesa: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const upd = {
            cierre: input.cierre,
            obs_cierre: input.obs_cierre,
          };
          await models.Mesa.update(
            { ...upd },
            {
              where: {
                id: input.id,
              },
            }
          );

          return true;
        });

        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};

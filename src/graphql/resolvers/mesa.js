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
            limit: 1,
            order: [["createdAt", "DESC"]],
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

      let a_favor = 0;
      let en_contra = 0;
      let en_cola = 0;
      let en_duda = 0;
      listMesa.forEach((mesa, index) => {
        a_favor =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].a_favor : 0;
        en_contra =
          mesa.ReporteVotacion.length > 0
            ? mesa.ReporteVotacion[0].en_contra
            : 0;
        en_cola =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].en_cola : 0;
        en_duda =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].en_duda : 0;

        const TotalElectores = {
          electores: mesa.electores,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
          en_duda: en_duda,
        };

        listMesa[index].TotalElectores = TotalElectores;
      });

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
            limit: 1,
            order: [["createdAt", "DESC"]],
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

      let a_favor = 0;
      let en_contra = 0;
      let en_cola = 0;
      let en_duda = 0;
      listMesa.forEach((mesa, index) => {
        a_favor =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].a_favor : 0;
        en_contra =
          mesa.ReporteVotacion.length > 0
            ? mesa.ReporteVotacion[0].en_contra
            : 0;
        en_cola =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].en_cola : 0;
        en_duda =
          mesa.ReporteVotacion.length > 0 ? mesa.ReporteVotacion[0].en_duda : 0;

        const TotalElectores = {
          electores: mesa.electores,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
          en_duda: en_duda,
        };

        listMesa[index].TotalElectores = TotalElectores;
      });

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

import moment from "moment";
import { encrypt } from "../../utils/security";
import { Op } from "sequelize";

export default {
  Query: {
    getCentroVotacionsAll: async (_, { search }, { models }) => {
      const options = search?.options ?? null;
      const searchText = search?.search ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        include: [
          {
            model: models.Mesa,
            as: "Mesa",
          },
          {
            model: models.Parroquia,
            as: "Parroquia",
          },
          {
            model: models.ReporteVotacion,
            as: "ReporteVotacion",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["ctro_prop", "ASC"]],
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

      if (searchText) {
        optionsFind.where = {
          nombre: { [Op.iLike]: `%${searchText}%` },
        };
      }

      const listCentroVotacion = await models.CentroVotacion.findAll(
        optionsFind
      );

      listCentroVotacion.forEach((element, index) => {
        const initialValue = 0;
        const sumWithInitial = element.Mesa.reduce(
          (accumulator, mesa) => accumulator + mesa.electores,
          initialValue
        );
        const a_favor =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].a_favor
            : 0;
        const en_contra =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_contra
            : 0;
        const en_cola =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_cola
            : 0;

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        listCentroVotacion[index].TotalElectores = TotalElectores;
      });

      const infoPage = {
        count: listCentroVotacion.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listCentroVotacion,
      };
    },
    getCentroVotacionsByParroquia: async (
      _,
      { search, cod_par },
      { models }
    ) => {
      if (!cod_par) {
        throw new Error("Falta el código de la parroquia");
      }

      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        where: {
          cod_par,
        },
        include: [
          {
            model: models.Mesa,
            as: "Mesa",
          },
          {
            model: models.ReporteVotacion,
            as: "ReporteVotacion",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["ctro_prop", "ASC"]],
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

      const listCentroVotacion = await models.CentroVotacion.findAll(
        optionsFind
      );

      listCentroVotacion.forEach((element, index) => {
        const initialValue = 0;
        const sumWithInitial = element.Mesa.reduce(
          (accumulator, mesa) => accumulator + mesa.electores,
          initialValue
        );
        const a_favor =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].a_favor
            : 0;
        const en_contra =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_contra
            : 0;
        const en_cola =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_cola
            : 0;

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        listCentroVotacion[index].TotalElectores = TotalElectores;
      });

      const infoPage = {
        count: listCentroVotacion.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listCentroVotacion,
      };
    },
  },
  Mutation: {
    aperturaCentroVotacion: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const upd = {
            apertura: input.apertura,
            obs_apertura: input.obs_apertura,
          };
          await models.CentroVotacion.update(
            { ...upd },
            {
              where: {
                ctro_prop: input.ctro_prop,
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
    cierreCentroVotacion: async (_, { input }, { models }) => {
      try {
        const result = await models.sequelizeInst.transaction(async (t) => {
          const upd = {
            cierre: input.cierre,
            obs_cierre: input.obs_cierre,
          };
          await models.CentroVotacion.update(
            { ...upd },
            {
              where: {
                ctro_prop: input.ctro_prop,
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

import moment from "moment";
import { encrypt } from "../../utils/security";

export default {
  Query: {
    getParroquiasAll: async (_, { search }, { models }) => {
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        include: {
          model: models.CentroVotacion,
          as: "CentroVotacion",
        },
        order: [["cod_par", "ASC"]],
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

      const listParroquia = await models.Parroquia.findAll(optionsFind);

      const infoPage = {
        count: listParroquia.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listParroquia,
      };
    },
    getParroquiasByMunicipio: async (_, { search, cod_mun }, { models }) => {
      if (!cod_mun) {
        throw new Error("Falta el código del municipio");
      }
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        where: {
          cod_mun,
        },
        include: {
          model: models.CentroVotacion,
          as: "CentroVotacion",
        },
        order: [["cod_par", "ASC"]],
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

      const listParroquia = await models.Parroquia.findAll(optionsFind);

      const infoPage = {
        count: listParroquia.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listParroquia,
      };
    },
  },
};

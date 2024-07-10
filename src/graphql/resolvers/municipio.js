import moment from "moment";
import { encrypt } from "../../utils/security";

export default {
  Query: {
    getMunicipiosAll: async (_, { search }, { models }) => {
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        include: {
          model: models.Parroquia,
          as: "Parroquia",
          mun,
        },
        order: [["cod_mun", "ASC"]],
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

      const listMunicipio = await models.Municipio.findAll(optionsFind);

      const infoPage = {
        count: listMunicipio.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listMunicipio,
      };
    },
    getMunicipiosByEstado: async (_, { search, cod_edo }, { models }) => {
      if (!cod_edo) {
        throw new Error("Falta el código de estado");
      }
      const options = search?.options ?? null;
      //PRIORITARIO arreglar consulta para que busque las options y filter y segun eso haga las busquedas
      const optionsFind = {
        where: {
          cod_edo,
        },
        include: {
          model: models.Parroquia,
          as: "Parroquia",
        },
        order: [["cod_mun", "ASC"]],
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

      const listMunicipio = await models.Municipio.findAll(optionsFind);

      const infoPage = {
        count: listMunicipio.length,
        pages: 1,
        current: 1,
        next: false,
        prev: false,
      };

      return {
        infoPage,
        results: listMunicipio,
      };
    },
  },
};

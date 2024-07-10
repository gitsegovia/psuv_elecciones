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

      listParroquia.forEach((element, index) => {
        const initialValue = 0;
        let a_favor = 0;
        let en_contra = 0;
        let en_cola = 0;
        const sumWithInitial = element.CentroVotacion.reduce((acc, centro) => {
          const sumWithInitialMesa = centro.Mesa.reduce(
            (accumulator, mesa) => accumulator + mesa.electores,
            0
          );
          const a_favor_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].a_favor
              : 0;
          const en_contra_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].en_contra
              : 0;
          const en_cola_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].en_cola
              : 0;
          a_favor += a_favor_centro;
          en_contra += en_contra_centro;
          en_cola += en_cola_centro;

          return acc + sumWithInitialMesa;
        }, initialValue);

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        listParroquia[index].TotalElectores = TotalElectores;
      });

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

      listParroquia.forEach((element, index) => {
        const initialValue = 0;
        let a_favor = 0;
        let en_contra = 0;
        let en_cola = 0;
        const sumWithInitial = element.CentroVotacion.reduce((acc, centro) => {
          const sumWithInitialMesa = centro.Mesa.reduce(
            (accumulator, mesa) => accumulator + mesa.electores,
            0
          );
          const a_favor_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].a_favor
              : 0;
          const en_contra_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].en_contra
              : 0;
          const en_cola_centro =
            centro.ReporteVotacion.length > 0
              ? centro.ReporteVotacion[0].en_cola
              : 0;
          a_favor += a_favor_centro;
          en_contra += en_contra_centro;
          en_cola += en_cola_centro;

          return acc + sumWithInitialMesa;
        }, initialValue);

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        listParroquia[index].TotalElectores = TotalElectores;
      });

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

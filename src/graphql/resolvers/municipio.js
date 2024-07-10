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

      listMunicipio.forEach((element, index) => {
        let a_favor = 0;
        let en_contra = 0;
        let en_cola = 0;
        let sumWithInitial = 0;
        let sumMesaAp = 0;
        let sumMesaCe = 0;
        let sumMesaNull = 0;

        element.Parroquia.forEach((par) => {
          par.CentroVotacion.forEach((centro) => {
            centro.Mesa.forEach((mesa) => {
              sumWithInitial += mesa.electores;
              if (mesa.apertura === null && mesa.cierre === null) {
                sumMesaNull++;
              }
              if (mesa.apertura !== null) {
                sumMesaAp++;
              }
              if (mesa.cierre !== null) {
                sumMesaCe++;
              }
            });
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
          });
        });

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        const InfoMesas = {
          aperturadas: sumMesaAp,
          cerradas: sumMesaCe,
          sin_aperturar: sumMesaNull,
        };
        listMunicipio[index].TotalElectores = TotalElectores;
        listMunicipio[index].InfoMesas = InfoMesas;
      });

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

      listMunicipio.forEach((element, index) => {
        let a_favor = 0;
        let en_contra = 0;
        let en_cola = 0;
        let sumWithInitial = 0;
        let sumMesaAp = 0;
        let sumMesaCe = 0;
        let sumMesaNull = 0;

        element.Parroquia.forEach((par) => {
          par.CentroVotacion.forEach((centro) => {
            centro.Mesa.forEach((mesa) => {
              sumWithInitial += mesa.electores;
              if (mesa.apertura === null && mesa.cierre === null) {
                sumMesaNull++;
              }
              if (mesa.apertura !== null) {
                sumMesaAp++;
              }
              if (mesa.cierre !== null) {
                sumMesaCe++;
              }
            });
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
          });
        });

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
        };
        const InfoMesas = {
          aperturadas: sumMesaAp,
          cerradas: sumMesaCe,
          sin_aperturar: sumMesaNull,
        };
        listMunicipio[index].TotalElectores = TotalElectores;
        listMunicipio[index].InfoMesas = InfoMesas;
      });

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

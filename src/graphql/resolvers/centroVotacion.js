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
            include: {
              model: models.ReporteVotacion,
              as: "ReporteVotacion",
              limit: 1,
              order: [["createdAt", "DESC"]],
            },
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
        let sumWithInitial = 0;
        let sumMesaAp = 0;
        let sumMesaCe = 0;
        let sumMesaNull = 0;
        let total_centros = 0;
        let total_c_reportado = 0;
        let total_c_sin_reportar = 0;
        let total_mesas = element.Mesa.length;
        let total_m_reportadas = 0;
        let total_m_sin_reportar = 0;

        element.Mesa.forEach((mesa) => {
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
          if (mesa.ReporteVotacion.length > 0) {
            total_m_reportadas++;
          } else {
            total_m_sin_reportar++;
          }
        });
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
        const en_duda =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_duda
            : 0;

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
          en_duda: en_duda,
        };
        const InfoMesas = {
          aperturadas: sumMesaAp,
          cerradas: sumMesaCe,
          sin_aperturar: sumMesaNull,
        };
        const TotalReportes = {
          total_centros,
          total_c_reportado,
          total_c_sin_reportar,
          total_mesas,
          total_m_reportadas,
          total_m_sin_reportar,
        };

        listCentroVotacion[index].TotalElectores = TotalElectores;
        listCentroVotacion[index].InfoMesas = InfoMesas;
        listCentroVotacion[index].TotalReportes = TotalReportes;
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
            include: {
              model: models.ReporteVotacion,
              as: "ReporteVotacion",
              limit: 1,
              order: [["createdAt", "DESC"]],
            },
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
        let sumWithInitial = 0;
        let sumMesaAp = 0;
        let sumMesaCe = 0;
        let sumMesaNull = 0;
        let total_centros = 0;
        let total_c_reportado = 0;
        let total_c_sin_reportar = 0;
        let total_mesas = element.Mesa.length;
        let total_m_reportadas = 0;
        let total_m_sin_reportar = 0;

        element.Mesa.forEach((mesa) => {
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

          if (mesa.ReporteVotacion.length > 0) {
            total_m_reportadas++;
          } else {
            total_m_sin_reportar++;
          }
        });
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
        const en_duda =
          element.ReporteVotacion.length > 0
            ? element.ReporteVotacion[0].en_duda
            : 0;

        const TotalElectores = {
          electores: sumWithInitial,
          a_favor: a_favor,
          en_contra: en_contra,
          en_cola: en_cola,
          en_duda: en_duda,
        };

        const InfoMesas = {
          aperturadas: sumMesaAp,
          cerradas: sumMesaCe,
          sin_aperturar: sumMesaNull,
        };

        const TotalReportes = {
          total_centros,
          total_c_reportado,
          total_c_sin_reportar,
          total_mesas,
          total_m_reportadas,
          total_m_sin_reportar,
        };

        listCentroVotacion[index].TotalElectores = TotalElectores;
        listCentroVotacion[index].InfoMesas = InfoMesas;
        listCentroVotacion[index].TotalReportes = TotalReportes;
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
    getCentroVotacionSinReportar: async (
      _,
      { cod_par },
      { models }
    ) => {
      if (!cod_par) {
        throw new Error("Falta el código de la parroquia");
      }

      const optionsFind = {
        where: {
          cod_par,
        },
        include: [
          {
            model: models.ReporteVotacion,
            as: "ReporteVotacion",
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
        order: [["ctro_prop", "ASC"]],
      };

      const listCentroVotacion = await models.CentroVotacion.findAll(
        optionsFind
      );

      const idCentros = listCentroVotacion.map(c => c.ctro_prop);
    
      const listCentroVotacionSinreportar = await models.CentroVotacion.findAll(
        {
          where: {
            ctro_prop: {
              [Op.notIn]: idCentros
            }
          }
        }
      );

      return listCentroVotacionSinreportar.map(c => c.nombre);
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

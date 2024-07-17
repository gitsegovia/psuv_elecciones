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
        let en_duda = 0;
        let sumWithInitial = 0;
        let sumMesaAp = 0;
        let sumMesaCe = 0;
        let sumMesaNull = 0;
        let total_parroquia = element.Parroquia.length;
        let total_p_reportado = 0;
        let total_p_sin_reportar = 0;
        let total_centros = 0;
        let total_c_reportado = 0;
        let total_c_sin_reportar = 0;
        let total_mesas = 0;
        let total_m_reportadas = 0;
        let total_m_sin_reportar = 0;

        element.Parroquia.forEach((par) => {
          total_centros += par.CentroVotacion.length;
          let sumpReportado = false;
          par.CentroVotacion.forEach((centro) => {
            total_mesas += centro.Mesa.length;
            let sumReportado = false;
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
              if (mesa.ReporteVotacion.length > 0) {
                total_m_reportadas++;
                sumReportado = true;
              } else {
                total_m_sin_reportar++;
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
            const en_duda_centro =
              centro.ReporteVotacion.length > 0
                ? centro.ReporteVotacion[0].en_duda
                : 0;
            a_favor += a_favor_centro;
            en_contra += en_contra_centro;
            en_cola += en_cola_centro;
            en_duda += en_duda_centro;

            if (sumReportado) {
              total_c_reportado++;
              sumpReportado = true;
            } else {
              total_c_sin_reportar++;
            }
          });
          if (sumpReportado) {
            total_p_reportado++;
          } else {
            total_p_sin_reportar++;
          }
        });

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
          total_parroquia,
          total_p_reportado,
          total_p_sin_reportar,
          total_centros,
          total_c_reportado,
          total_c_sin_reportar,
          total_mesas,
          total_m_reportadas,
          total_m_sin_reportar,
        };

        listMunicipio[index].TotalElectores = TotalElectores;
        listMunicipio[index].InfoMesas = InfoMesas;
        listMunicipio[index].TotalReportes = TotalReportes;
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
        let en_duda = 0;
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
            const en_duda_centro =
              centro.ReporteVotacion.length > 0
                ? centro.ReporteVotacion[0].en_duda
                : 0;
            a_favor += a_favor_centro;
            en_contra += en_contra_centro;
            en_cola += en_cola_centro;
            en_duda += en_duda_centro;
          });
        });

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

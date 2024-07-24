"use server";

import prisma from "@/prisma/prisma";
import { CompositionsType, SolutionType } from "../../app/IndexedDB/IndexedDB";

/**
 * Добавляет растворы в базу данных.
 * @param {SolutionType[]} toAdd - Массив объектов растворов, которые нужно добавить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toAddSolutions = async (toAdd: SolutionType[]): Promise<void> => {
  try {
    if (toAdd.length > 0) {
      await prisma.solution.createMany({
        data: toAdd.map((item: SolutionType) => ({
          id: item.id,
          titleSolution: item.titleSolution,
          valueSolution: item.valueSolution,
          version: item.version,
        })),
        skipDuplicates: true,
      });
    }
    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Удаляет растворы из базы данных.
 * @param {SolutionType[]} toDelete - Массив объектов растворов, которые нужно удалить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toDeleteSolutions = async (
  toDelete: SolutionType[]
): Promise<void> => {
  try {
    if (toDelete.length > 0) {
      await Promise.all(
        toDelete.map(async (item: SolutionType) => {
          // Проверка существования записи перед действием
          const existingSolution = await prisma.solution.findUnique({
            where: { id: item.id },
          });
          if (existingSolution) {
            await prisma.solution.delete({
              where: { id: item.id },
            });
          }
        })
      );
    }
    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Обновляет растворы в базе данных.
 * @param {SolutionType[]} toUpdate - Массив объектов растворов, которые нужно обновить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toUpdateSolutions = async (
  toUpdate: SolutionType[]
): Promise<void> => {
  try {
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(async (item: SolutionType) => {
          // Проверка существования записи перед действием
          const existingSolution = await prisma.solution.findUnique({
            where: { id: item.id },
          });
          if (existingSolution) {
            await prisma.solution.update({
              where: { id: item.id },
              data: {
                titleSolution: item.titleSolution,
                valueSolution: item.valueSolution,
                version: item.version,
              },
            });
          }
        })
      );
    }

    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Добавляет состав в базу данных.
 * @param {CompositionsType[]} toAdd - Массив объектов состава, которые нужно добавить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toAddCompositions = async (
  toAdd: CompositionsType[]
): Promise<void> => {
  try {
    if (toAdd.length > 0) {
      await prisma.composition.createMany({
        data: toAdd.map((item: CompositionsType) => ({
          id: item.id,
          solutionId: item.solutionId,
          titleComposition: item.titleComposition,
          valueComposition: item.valueComposition,
          version: item.version,
        })),
        skipDuplicates: true,
      });
    }
    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Удаляет состав из базы данных.
 * @param {CompositionsType[]} toDelete - Массив объектов состава, которые нужно удалить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toDeleteCompositions = async (
  toDelete: CompositionsType[]
): Promise<void> => {
  try {
    if (toDelete.length > 0) {
      await Promise.all(
        toDelete.map(async (item: CompositionsType) => {
          // Проверка существования записи перед действием
          const existingComposition = await prisma.composition.findUnique({
            where: { id: item.id },
          });
          if (existingComposition) {
            await prisma.composition.delete({
              where: { id: item.id },
            });
          }
        })
      );
    }
    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Обновляет состав в базе данных.
 * @param {CompositionsType[]} toUpdate - Массив объектов состава, которые нужно обновить.
 * @returns {Promise<void>} Возвращает промис, который завершается после завершения операции.
 */
export const toUpdateCompositions = async (
  toUpdate: CompositionsType[]
): Promise<void> => {
  try {
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(async (item: CompositionsType) => {
          // Проверка существования записи перед действием
          const existingComposition = await prisma.composition.findUnique({
            where: { id: item.id },
          });
          if (existingComposition) {
            await prisma.composition.update({
              where: { id: item.id },
              data: {
                solutionId: item.solutionId,
                titleComposition: item.titleComposition,
                valueComposition: item.valueComposition,
                version: item.version,
              },
            });
          }
        })
      );
    }

    console.log("Данные успешно синхронизированы с сервером");
  } catch (error) {
    throw error;
  }
};

/**
 * Получает данные из базы данных с помощью Prisma.
 * @returns {Promise<[SolutionType[], CompositionsType[]]>} Возвращает промис с массивами объектов решений и состава.
 */
export const getDataPrisma = async (): Promise<
  [SolutionType[], CompositionsType[]]
> => {
  const solutionsPrisma = await prisma.solution.findMany();
  console.log(solutionsPrisma);
  const compositionsPrisma = await prisma.composition.findMany();
  return [solutionsPrisma, compositionsPrisma];
};

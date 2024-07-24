"use client";

import {
  clearFlags,
  clearOfDelFlag,
  compositionStoreName,
  getFlaggedData,
  solutionStoreName,
  updateData,
} from "@/app/IndexedDB/IndexedDB";
import {
  getDataPrisma,
  toAddCompositions,
  toAddSolutions,
  toDeleteCompositions,
  toDeleteSolutions,
  toUpdateCompositions,
  toUpdateSolutions,
} from "@/prisma/actions/actions";

/**
 * Синхронизирует данные с сервера и обновляет локальное хранилище.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const syncFromServer = async (): Promise<void> => {
  try {
    // Получаем данные раствора и состава с сервера
    const [solutionsPrisma, compositionsPrisma] = await getDataPrisma();

    // Обновляем данные раствора в локальном хранилище
    await updateData(solutionStoreName, solutionsPrisma);
    
    // Получаем помеченные данные раствора из локального хранилища
    const flaggedDataSolutions = await getFlaggedData(solutionStoreName);
    
    // Очищаем флаги для добавленных и обновленных записей раствора
    await clearFlags(solutionStoreName, flaggedDataSolutions.toAdd);
    await clearFlags(solutionStoreName, flaggedDataSolutions.toUpdate);

    // Обновляем данные состава в локальном хранилище
    await updateData(compositionStoreName, compositionsPrisma);
    
    // Получаем помеченные данные состава из локального хранилища
    const flaggedDataCompositions = await getFlaggedData(compositionStoreName);
    
    // Очищаем флаги для добавленных и обновленных записей состава
    await clearFlags(compositionStoreName, flaggedDataCompositions.toAdd);
    await clearFlags(compositionStoreName, flaggedDataCompositions.toUpdate);
  } catch (error) {
    throw error; 
  }
};

/**
 * Синхронизирует данные из локального хранилища на сервер.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const syncFromIDB = async (): Promise<void> => {
  try {
    // Получаем помеченные данные раствора из локального хранилища
    const flaggedDataSolutions = await getFlaggedData(solutionStoreName);

    // Добавляем новые решения на сервер и очищаем флаги в локальном хранилище
    await toAddSolutions(flaggedDataSolutions.toAdd);
    await clearFlags(solutionStoreName, flaggedDataSolutions.toAdd);

    // Удаляем решения на сервере и очищаем флаги в локальном хранилище
    await toDeleteSolutions(flaggedDataSolutions.toDelete);
    await clearOfDelFlag(solutionStoreName, flaggedDataSolutions.toDelete);

    // Обновляем решения на сервере и очищаем флаги в локальном хранилище
    await toUpdateSolutions(flaggedDataSolutions.toUpdate);
    await clearFlags(solutionStoreName, flaggedDataSolutions.toUpdate);

    // Получаем помеченные данные состава из локального хранилища
    const flaggedDataCompositions = await getFlaggedData(compositionStoreName);

    // Добавляем новые композиции на сервер и очищаем флаги в локальном хранилище
    await toAddCompositions(flaggedDataCompositions.toAdd);
    await clearFlags(compositionStoreName, flaggedDataCompositions.toAdd);

    // Удаляем композиции на сервере и очищаем флаги в локальном хранилище
    await toDeleteCompositions(flaggedDataCompositions.toDelete);
    await clearOfDelFlag(compositionStoreName, flaggedDataCompositions.toDelete);

    // Обновляем композиции на сервере и очищаем флаги в локальном хранилище
    await toUpdateCompositions(flaggedDataCompositions.toUpdate);
    await clearFlags(compositionStoreName, flaggedDataCompositions.toUpdate);
  } catch (error) {
    throw error; 
  }
};

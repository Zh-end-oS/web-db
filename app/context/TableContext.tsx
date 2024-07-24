"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  compositionStoreName,
  solutionStoreName,
  SolutionType,
  CompositionsType,
  getTransaction,
  flagsActionsAddOrUpdate,
  updateData,
  deleteSolutionIDB,
} from "../IndexedDB/IndexedDB";
import { syncFromIDB, syncFromServer } from "@/middleware/middleware";

type TableContextType = {
  // Выделенный элемент строки таблицы растворов
  selectedElementSolution: string | null;

  // Обновить выделение раствора
  updateSelectedElementSolution: (idEl: string | null) => Promise<void>;

  // Функция установки элемента как выделенного строки таблицы растворов
  setSelectedElementSolution: Dispatch<SetStateAction<string | null>>;

  // Список растворов
  solutions: SolutionType[];
  getSolutions: () => Promise<void>;
  deleteSolutions: (id: string) => Promise<void>;
  createSolutions: (data: SolutionType) => Promise<void>;

  // Список состава
  compositions: CompositionsType[];
  updateCompositions: (
    data: CompositionsType[],
    solutionId: string
  ) => Promise<void>;

  syncDataFromIndexedDB: () => Promise<void>;
  syncDataFromServer: () => Promise<void>;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

/**
 * Провайдер контекста таблицы.
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние компоненты.
 * @returns {JSX.Element} Провайдер контекста таблицы.
 */
const TableContextProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  // Список растворов
  const [solutions, setSolutions] = useState<SolutionType[]>([]);
  // Список состава
  const [compositions, setCompositions] = useState<CompositionsType[]>([]);
  // Выделение раствора
  const [selectedElementSolution, setSelectedElementSolution] = useState<
    string | null
  >(null);

  /**
   * Обновляет выделенный элемент раствора и получает данные состава.
   * @param {string | null} idEl - Идентификатор выделенного раствора.
   * @returns {Promise<void>} Промис, который разрешается после обновления.
   */
  const updateSelectedElementSolution = async (
    idEl: string | null
  ): Promise<void> => {
    setSelectedElementSolution(idEl); // Выделить строку
    console.log("selectedElementSolution", idEl);
    try {
      await getCompositions(idEl);
    } catch (error) {
      setCompositions([]);
      throw "Не удалось получить список состава.";
    }
  };

  /**
   * Получает список растворов из IndexedDB.
   * @returns {Promise<void>} Промис, который разрешается после получения данных.
   */
  const getSolutions = async (): Promise<void> => {
    try {
      const solutionsData = await getTransaction(solutionStoreName); // Ожидаем завершения получения данных
      console.log("1solutionsData", solutionsData);
      setSolutions(solutionsData); // Устанавливаем данные в контекст
    } catch (error) {
      throw "Не удалось получить список растворов."; // Пробрасываем ошибку дальше
    }
  };

  /**
   * Удаляет раствор по идентификатору.
   * @param {string} id - Идентификатор раствора для удаления.
   * @returns {Promise<void>} Промис, который разрешается после удаления.
   */
  const deleteSolutions = async (id: string): Promise<void> => {
    try {
      await deleteSolutionIDB(id); // Ожидаем завершения удаления
      await getSolutions(); // После удаления вызываем функцию получения растворов
      await updateSelectedElementSolution(null); // Обновить выделение раствора
      setCompositions([]);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Создает новый раствор.
   * @param {SolutionType} data - Данные для нового раствора.
   * @returns {Promise<void>} Промис, который разрешается после создания раствора.
   */
  const createSolutions = async (data: SolutionType): Promise<void> => {
    try {
      const newEl = await flagsActionsAddOrUpdate(solutionStoreName, data); // Ожидаем завершения создания
      console.log("33");
      await getSolutions(); // После добавления вызываем функцию получения растворов
      console.log("44", solutions);
      await updateSelectedElementSolution(newEl); // Обновить выделение раствора
      setCompositions([]);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Получает состав для выделенного раствора.
   * @param {string | null} idEl - Идентификатор раствора.
   * @returns {Promise<void>} Промис, который разрешается после получения состава.
   */
  const getCompositions = async (idEl: string | null): Promise<void> => {
    if (idEl) {
      try {
        const сompositionsData = await getTransaction(
          compositionStoreName,
          idEl,
          "solutionId"
        ); // Ожидаем завершения получения данных
        setCompositions(сompositionsData); // Установить в контекст данные
      } catch (error) {
        throw error;
      }
    } else {
      setCompositions([]);
    }
  };

  /**
   * Обновляет состав для раствора.
   * @param {CompositionsType[]} data - Данные состава.
   * @param {string} solutionId - Идентификатор раствора.
   * @returns {Promise<void>} Промис, который разрешается после обновления состава.
   */
  const updateCompositions = async (
    data: CompositionsType[],
    solutionId: string
  ): Promise<void> => {
    try {
      // Вызов функции updateData
      await updateData(compositionStoreName, data, solutionId);
      await getCompositions(solutionId);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Выгружает данные с IndexedDB.
   * @returns {Promise<void>} Промис, который разрешается после синхронизации.
   */
  const syncDataFromIndexedDB = async (): Promise<void> => {
    try {
      await syncFromIDB();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  /**
   * Выгружает данные с сервера.
   * @returns {Promise<void>} Промис, который разрешается после синхронизации.
   */
  const syncDataFromServer = async (): Promise<void> => {
    try {
      await syncFromServer();
      await getSolutions();

      await updateSelectedElementSolution(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    syncDataFromServer();
  }, []);

  return (
    <TableContext.Provider
      value={{
        selectedElementSolution,
        setSelectedElementSolution,

        updateSelectedElementSolution,

        solutions,
        getSolutions,
        deleteSolutions,
        createSolutions,

        compositions,
        updateCompositions,

        syncDataFromIndexedDB,
        syncDataFromServer,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

/**
 * Хук для использования контекста таблицы.
 * @returns {TableContextType} Контекст таблицы.
 * @throws {Error} Если контекст используется вне провайдера.
 */
const useTable = (): TableContextType => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error(
      "useTable должен использоваться в контексте TableContextProvider!"
    );
  }

  return context;
};

export { useTable, TableContextProvider };

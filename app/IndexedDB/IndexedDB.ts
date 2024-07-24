"use client";

const dbName = "myDatabase";

export const solutionStoreName = "Solution";
export const compositionStoreName = "Composition";
export type StoreNamesType =
  | typeof compositionStoreName
  | typeof solutionStoreName;

export type CompositionsType = {
  id: string;
  solutionId: string;
  titleComposition: string;
  valueComposition: number;
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
  version: number;
};

export type SolutionType = {
  id: string;
  titleSolution: string;
  valueSolution: number;
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
  version: number;
};

export type SolCompType = SolutionType | CompositionsType;
export type ArrSolCompType = SolCompType[];
export type SolArrCompArrType = SolutionType[] | CompositionsType[];

// Объявляем локальную базу данных
let dbInstance: IDBDatabase | null = null;

/**
 * Открывает локальную базу данных и создает хранилища при необходимости.
 * @returns {Promise<IDBDatabase>} Объект базы данных.
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    // Если БД открыта, возвращаем базу и выходим
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }
    // Открываем базу данных
    const request = indexedDB.open(dbName, 1);

    // При обновлении или создании БД проверяем существование хранилищ и создаем несуществующие
    request.onupgradeneeded = () => {
      const db = request.result;
      try {
        // Создаем хранилище для Solution, если его нет
        if (!db.objectStoreNames.contains(solutionStoreName)) {
          const solutionStore = db.createObjectStore(solutionStoreName, {
            keyPath: "id",
          });
          // Создаем индексы для Solution
          solutionStore.createIndex("isNew", "isNew");
          solutionStore.createIndex("isUpdated", "isUpdated");
          solutionStore.createIndex("isDeleted", "isDeleted");
        }

        // Создаем хранилище для Composition, если его нет
        if (!db.objectStoreNames.contains(compositionStoreName)) {
          const compositionStore = db.createObjectStore(compositionStoreName, {
            keyPath: "id",
          });
          compositionStore.createIndex("solutionId", "solutionId");
          compositionStore.createIndex("isNew", "isNew");
          compositionStore.createIndex("isUpdated", "isUpdated");
          compositionStore.createIndex("isDeleted", "isDeleted");
        }
      } catch (upgradeError) {
        reject(upgradeError);
      }
    };

    // Если открытие завершилось успешно, обновляем значение dbInstance и возвращаем ответ на выполнение openDB()
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    // Если открытие завершилось неудачно, возвращаем ответ на выполнение openDB()
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Открывает базу данных и возвращает объект хранилища с указанной транзакцией.
 * @param {StoreNamesType} storeName Название хранилища.
 * @param {IDBTransactionMode} mode Режим транзакции (readonly или readwrite).
 * @returns {Promise<IDBObjectStore>} Объект хранилища.
 */
const getObjectStore = async (
  storeName: StoreNamesType,
  mode: IDBTransactionMode
): Promise<IDBObjectStore> => {
  const db = await openDB();
  const transaction = db.transaction(storeName, mode);
  return transaction.objectStore(storeName);
};

/**
 * Получает данные из хранилища.
 *
 * @param {StoreNamesType} storeName - название хранилища.
 * @param {string} [queryKey] - поиск по ключу объекта хранилища.
 * @param {string} [fieldKey] - поиск по значению поля объекта хранилища.
 * @returns {Promise<any[]>} Возвращает массив данных из IndexedDB.
 */
export const getTransaction = async (
  storeName: StoreNamesType,
  queryKey?: string,
  fieldKey?: string
): Promise<any[]> => {
  const objectStore = await getObjectStore(storeName, "readonly");

  const store = fieldKey ? objectStore.index(fieldKey) : objectStore; // Если указан fieldKey, то используем индекс для поиска, иначе используем само хранилище
  const query = queryKey ? IDBKeyRange.only(queryKey) : null;

  // Возвращаем Promise для получения всех данных по запросу
  return new Promise((resolve, reject) => {
    const request = store.getAll(query); // Получаем все данные из хранилища по запросу

    request.onsuccess = () => resolve(filteredResults(request.result)); // В случае успешного выполнения запроса, возвращаем отфильтрованный результат
    request.onerror = () => reject(request.error); // В случае ошибки, возвращаем ошибку
  });
};

/**
 * Выполняет фильтрацию результатов, исключая помеченные как удаленные.
 * @param {SolArrCompArrType} results Массив данных.
 * @returns {ArrSolCompType} Отфильтрованный массив данных.
 */
const filteredResults = (results: SolArrCompArrType): ArrSolCompType => {
  return results.filter((item) => item.isDeleted !== true);
};

/**
 * Выполняет транзакцию для добавления или обновления данных в указанном хранилище.
 * @param {StoreNamesType} storeName Название хранилища.
 * @param {SolCompType} data Данные для добавления или обновления.
 * @returns {Promise<any>} Результат операции.
 */
const putTransaction = async (
  storeName: StoreNamesType,
  data: SolCompType
): Promise<any> => {
  console.log(data);
  const store = await getObjectStore(storeName, "readwrite");

  return new Promise((resolve, reject) => {
    const getRequest = store.get(data.id);
    getRequest.onsuccess = async () => {
      const existingData = getRequest.result;

      if (existingData && data.version < existingData.version) {
        data.version = existingData.version + 1;
      }

      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Выполняет транзакцию для удаления данных из указанного хранилища.
 * @param {StoreNamesType} storeName Название хранилища.
 * @param {SolCompType} data Данные для удаления.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
const deleteTransaction = async (
  storeName: StoreNamesType,
  data: SolCompType
): Promise<void> => {
  const store = await getObjectStore(storeName, "readwrite");

  const keyId = data.id;
  return new Promise((resolve, reject) => {
    const request = store.delete(keyId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Выполняет действия, на основе имеющихся флагов записей.
 * @param {StoreNamesType} storeName - Имя хранилища объектов.
 * @param {SolCompType} data - Данные для добавления или обновления.
 * @returns {Promise<any>} Промис без возвращаемого значения.
 */
export const flagsActionsAddOrUpdate = async (
  storeName: StoreNamesType,
  data: SolCompType
): Promise<any> => {
  const store = await getObjectStore(storeName, "readwrite");
  console.log(data);

  // Получаем запись из базы

  return new Promise((resolve, reject) => {
    const getRequest = store.get(data.id);

    getRequest.onsuccess = async () => {
      // Запись из хранилища
      const existingData = getRequest.result;
      // Если запись на удаление
      if (data.isDeleted) {
        if (data.isNew) {
          const request = deleteTransaction(storeName, data);
          return resolve(request);
        } else {
          console.log(1);
          data.isUpdated = false;
          data.isNew = false;
          const request = putTransaction(storeName, data);
          return resolve(request);
        }
      }

      if (data.version > 0 && existingData) {
        if (existingData.isNew) {
          data.isNew = true;
        } else if (existingData.isUpdated) {
          data.isUpdated = true;
        } else {
          data.isUpdated = true;
          data.version += 1;
          console.log(4);
        }
        const request = putTransaction(storeName, data);
        return resolve(request);
      } else {
        // Если версии новых данных нет (новая запись)
        data.isNew = true;
        data.isUpdated = false;
        data.version = 1;
        const request = putTransaction(storeName, data);
        return resolve(request);
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Удаляет запись по указанному идентификатору.
 * @param {string} id Идентификатор данных для удаления.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const deleteSolutionIDB = async (id: string): Promise<void> => {
  const solutionData = await getTransaction(solutionStoreName, id);
  const solutionDeletions = solutionData.map(async (solution) => {
    solution.isDeleted = true;
    await flagsActionsAddOrUpdate(solutionStoreName, solution); // Обновляем статус решения
    await updateData(compositionStoreName, [], id); // Удаляем связанное в Composition
  });
  const solutionDeletionsPromises = Promise.all(solutionDeletions);

  // Ожидаем завершения всех промисов
  return new Promise((resolve, reject) => {
    solutionDeletionsPromises
      .then(() => resolve()) // Если все промисы завершились успешно, вызываем resolve
      .catch((error) => reject(error)); // Если какой-либо промис отклонен, вызываем reject с ошибкой
  });
};

/**
 * Находит идентификаторы, отсутствующие во втором массиве.
 * @param {SolArrCompArrType} storeData Массив данных из хранилища.
 * @param {SolArrCompArrType} data Массив данных для сравнения.
 * @returns {ArrSolCompType} Массив объектов, отсутствующих во втором массиве.
 */
const findIdsNotInSecondArray = (
  storeData: SolArrCompArrType,
  data: SolArrCompArrType
): ArrSolCompType => {
  const idData = data.map((item) => item.id);

  // Фильтруем объекты из storeData, которых нет во втором массиве
  const clearEntryArr = storeData.filter((item) => !idData.includes(item.id));
  return clearEntryArr;
};

/**
 * Добавляет или обновляет данные в указанном хранилище.
 * @param {StoreNamesType} storeName Название хранилища.
 * @param {SolArrCompArrType} data Массив данных для добавления или обновления.
 * @param {string} [solutionId] Идентификатор решения для фильтрации.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const updateData = async (
  storeName: StoreNamesType,
  data: SolArrCompArrType,
  solutionId?: string
): Promise<void> => {
  // Если был передан ключ, передаем и поле
  const filterKey = solutionId ? "solutionId" : undefined;
  // Получаем данные из хранилища по указанному solutionId
  const storeData = await getTransaction(storeName, solutionId, filterKey);
  // Находим идентификаторы, которые необходимо удалить
  const clearEntryArr = findIdsNotInSecondArray(storeData, data);

  // Промисы для удаления записей
  const deletePromises = clearEntryArr.map((el) => {
    el.isDeleted = true;
    return flagsActionsAddOrUpdate(storeName, el);
  });
  // Промисы для добавления/обновления записей
  const putPromises = data.map((el) => {
    el.isDeleted = false;
    return flagsActionsAddOrUpdate(storeName, el);
  });

  // Объединяем их в один массив
  const updateDataPromises = Promise.all([...deletePromises, ...putPromises]);

  // Ожидаем завершения всех промисов
  return new Promise((resolve, reject) => {
    updateDataPromises
      .then(() => resolve()) // Если все промисы завершились успешно, вызываем resolve
      .catch((error) => reject(error)); // Если какой-либо промис отклонен, вызываем reject с ошибкой
  });
};

/**
 * Получает данные, помеченные для добавления, обновления или удаления.
 * @param {StoreNamesType} storeName Название хранилища.
 * @returns {Promise<any>} Объект с массивами данных для добавления, обновления и удаления.
 */
export const getFlaggedData = async (
  storeName: StoreNamesType
): Promise<any> => {
  const store = await getObjectStore(storeName, "readonly");

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const result = request.result;
      const toAdd = result.filter((item) => item.isNew);
      const toUpdate = result.filter((item) => item.isUpdated);
      const toDelete = result.filter((item) => item.isDeleted);
      resolve({ toAdd, toUpdate, toDelete });
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Очищает флаги новых и обновленных записей.
 * @param {StoreNamesType} storeName - Имя хранилища объектов.
 * @param {SolArrCompArrType} data - Данные для очистки флагов.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const clearFlags = async (
  storeName: StoreNamesType,
  data: SolArrCompArrType
): Promise<void> => {
  // Создаем переменную для всех промисов, связанных с очисткой флагов
  const clearFlagsPromises = Promise.all(
    data.map(async (item: SolCompType) => {
      item.isNew = false;
      item.isUpdated = false;
      console.log(5);
      await putTransaction(storeName, item);
    })
  );

  // Возвращаем новый промис, который будет разрешен или отклонен в зависимости от результата clearFlagsPromises
  return new Promise((resolve, reject) => {
    clearFlagsPromises
      .then(() => resolve()) // Если все промисы завершились успешно, вызываем resolve
      .catch((error) => reject(error)); // Если какой-либо промис отклонен, вызываем reject с ошибкой
  });
};

/**
 * Очищает записи, помеченные как удаляемые.
 * @param {StoreNamesType} storeName - Имя хранилища объектов.
 * @param {SolArrCompArrType} data - Данные для очистки флагов удаления.
 * @returns {Promise<void>} Промис без возвращаемого значения.
 */
export const clearOfDelFlag = async (
  storeName: StoreNamesType,
  data: SolArrCompArrType
): Promise<void> => {
  // Создаем промис для всех операций удаления
  const deletionPromises = Promise.all(
    data.map(async (item: SolCompType) => {
      await deleteTransaction(storeName, item);
    })
  );

  // Возвращаем новый промис, который будет разрешен или отклонен в зависимости от результата deletionPromises
  return new Promise((resolve, reject) => {
    deletionPromises
      .then(() => resolve()) // Если все промисы завершились успешно, вызываем resolve
      .catch((error) => reject(error)); // Если какой-либо промис отклонен, вызываем reject с ошибкой
  });
};

"use client";

import MyTable, { DatasTableType } from "../../ui/MyTable";
import { useModal } from "../../ui/MyModal";
import { useTable } from "../../../context/TableContext";
import ButtonsAddDelete from "../../ui/ButtonsAddDelete";
import { ModalContentCreate, ModalContentDelete } from "./SolutionModals";
import { toast } from "@/components/ui/use-toast";

/**
 * Компонент для отображения таблицы решений.
 * @param {DatasTableType} tableProps - Свойства для компонента таблицы.
 * @returns {JSX.Element} Возвращает компонент `SolutionTable` с переданными пропсами.
 */
export default function SolutionTable(tableProps: DatasTableType): JSX.Element {
  const { openModal } = useModal(); // Получаем функцию открытия модального окна
  const {
    selectedElementSolution, // Получаем выбранный элемент из контекста таблицы
    updateSelectedElementSolution, // Получаем функцию обновления из контекста таблицы
  } = useTable();

  /**
   * Функция для обработки нажатия кнопки добавления.
   * Открывает модальное окно для создания новой записи.
   */
  function clickPlus() {
    openModal({
      modalContent: <ModalContentCreate />, // Устанавливаем содержимое модального окна
      modalHeader: "Создание записи", // Устанавливаем заголовок модального окна
    });
  }

  /**
   * Функция для обработки нажатия кнопки удаления.
   * Открывает модальное окно для удаления выбранной записи.
   */
  function clickMinus() {
    openModal({
      modalContent: <ModalContentDelete />, // Устанавливаем содержимое модального окна
      modalHeader: "Удаление записи", // Устанавливаем заголовок модального окна
    });
  }

  /**
   * Функция для обработки клика по строке таблицы.
   * Обновляет выбранный элемент решения.
   * @param {string} idEl - Идентификатор элемента.
   */
  const rowClick = async (idEl: string) => {
    try {
      await updateSelectedElementSolution(idEl); // Обновляем выбранный элемент раствора
    } catch (error) {
      toast({
        title: "Ошибка", // Заголовок уведомления об ошибке
        description: `${error}`, // Описание ошибки
        variant: "destructive", // Вариант уведомления (деструктивное)
      });
    }
  };

  return (
    <MyTable
      {...tableProps} // Передаем все свойства таблицы компоненту MyTable
      rowClick={rowClick} // Устанавливаем обработчик клика по строке таблицы
      selectedRow={selectedElementSolution} // Передаем выбранную строку таблицы
    >
      <ButtonsAddDelete
        clickPlus={clickPlus} // Устанавливаем обработчик клика по кнопке добавления
        clickMinus={clickMinus} // Устанавливаем обработчик клика по кнопке удаления
        isDisabledMinus={!!!selectedElementSolution} // Отключаем кнопку удаления, если нет выбранного элемента
      />
    </MyTable>
  );
}

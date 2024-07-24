"use client";

import MyTable, { DatasTableType } from "../../ui/MyTable";
import { useModal } from "../../ui/MyModal";
import { Button } from "@/components/ui/button";
import { ModalContentChange } from "./CompositionModals";
import { useTable } from "@/app/context/TableContext";

/**
 * Компонент для отображения таблицы состава с возможностью его изменения.
 * @param {DatasTableType} tableProps - Свойства для компонента таблицы.
 * @returns {JSX.Element} Возвращает компонент `SolutionTable` с переданными пропсами.
 */
export default function SolutionTable(tableProps: DatasTableType): JSX.Element {
  const { openModal } = useModal(); // Получаем функцию открытия модального окна из контекста модального окна
  const { selectedElementSolution } = useTable(); // Получаем выбранный элемент из контекста таблицы

  /**
   * Обработчик клика для открытия модального окна изменения.
   */
  const handlerClickChange = () => {
    if (selectedElementSolution) {
      // Проверяем, что раствор выделен
      openModal({
        modalContent: <ModalContentChange />, // Устанавливаем содержимое модального окна
        modalData: selectedElementSolution, // Передаем данные в модальное окно
        modalHeader: "Изменить состав", // Устанавливаем заголовок модального окна
      });
    }
  };

  return (
    <MyTable {...tableProps}>
      <Button
        variant={"outline"}
        className={"min-w-12 h-8 bg-selected py-1 "}
        onClick={() => handlerClickChange()} // Устанавливаем обработчик клика по кнопке изменения
        disabled={!!!selectedElementSolution} // Отключаем кнопку, если нет выбранного элемента
      >
        Изменить
      </Button>
    </MyTable>
  );
}

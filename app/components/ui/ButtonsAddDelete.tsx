"use client";

import { Button } from "@/components/ui/button";

type ButtonsAddDeleteType = {
  clickPlus?: (...args: any[]) => any;
  clickMinus?: (...args: any[]) => any;
  isDisabledPlus?: boolean;
  isDisabledMinus?: boolean;
};

/**
 * Компонент, предоставляющий две кнопки для добавления и удаления.
 * @param {ButtonsAddDeleteType} props - Свойства компонента.
 * @returns {JSX.Element} Возвращает компонент с двумя кнопками.
 */
export default function ButtonsAddDelete(
  props: ButtonsAddDeleteType
): JSX.Element {
  const { isDisabledMinus, clickPlus, clickMinus } = props;

  /**
   * Обработчик для нажатия на кнопку "+".
   * Вызывает функцию `clickPlus`, если она предоставлена.
   */
  function handlerClickPlus() {
    if (clickPlus) {
      clickPlus();
    }
  }

  /**
   * Обработчик для нажатия на кнопку "-".
   * Вызывает функцию `clickMinus`, если она предоставлена.
   */
  function handlerClickMinus() {
    if (clickMinus) {
      clickMinus();
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={"outline"}
        className={"min-w-12 h-8 bg-selected py-1 "}
        onClick={() => handlerClickPlus()}
      >
        +
      </Button>
      <Button
        variant={"outline"}
        className={"min-w-12 bg-selected py-1"}
        onClick={() => handlerClickMinus()}
        disabled={isDisabledMinus}
      >
        -
      </Button>
    </div>
  );
}

"use client";

import { ReactNode } from "react";

type WindowType = {
  header?: string;
  children?: ReactNode;
};

/**
 * Компонент Window.
 *
 * @param {WindowType} props - Пропсы компонента.
 * @param {string} [props.header] - Заголовок окна.
 * @param {ReactNode} [props.children] - Дочерние элементы внутри окна.
 * @returns {JSX.Element} Возвращает JSX элемент, представляющий окно с заголовком и содержимым.
 */
export default function Window({ header, children }: WindowType): JSX.Element {
  return (
    <div className="bg-xp border-2 border-[#0BA0EE] ring-1 ring-[#066596]">
      <div className="flex justify-center text-white font-medium bg-gradient-to-r from-[#165A7D] via-[#0A7AB4] to-[#165A7D]">
        <span className="drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] py-1.5">
          {header}
        </span>
      </div>
      <div className="w-[800px] h-[500px] space-y-10 p-2 border border-[#165A7D]">
        {children}
      </div>
    </div>
  );
}

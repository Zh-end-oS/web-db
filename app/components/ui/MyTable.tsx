"use client";

import { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// Тип данных для строк таблицы
type DataType = Record<string, any>;

// Типизация свойств компонента MyTable
export type DatasTableType = {
  rowClick?: (...args: any[]) => any;
  selectedRow?: string | null;
  header?: string;
  styleCell?: string;
  children?: ReactNode;
  data?: DataType[];
  colContentHeader?: Record<string, string>;
};

/**
 * Компонент `MyTable` - таблица для отображения данных.
 *
 * @param {Object} props - Параметры компонента
 * @param {Function} [props.rowClick] - Функция, вызываемая при клике на строку таблицы. Принимает идентификатор строки в качестве аргумента.
 * @param {string | null} [props.selectedRow] - Идентификатор выбранной строки. Определяет, какая строка будет выделена.
 * @param {string} [props.header] - Заголовок таблицы. Отображается над таблицей.
 * @param {string} [props.styleCell] - Класс для стилизации ячеек таблицы.
 * @param {ReactNode} [props.children] - Дочерние элементы, отображаемые над таблицей.
 * @param {DataType[]} [props.data] - Данные для отображения в таблице. Каждый элемент представляет собой объект с ключами, соответствующими заголовкам столбцов.
 * @param {Record<string, string>} [props.colContentHeader] - Заголовки столбцов таблицы. Ключи объекта соответствуют именам свойств в данных, а значения - тексту заголовков.
 * @returns {JSX.Element} Возвращает компонент `MyTable` с переданными пропсами.
 */
export default function MyTable({
  rowClick,
  header,
  selectedRow,
  styleCell,
  children,
  data = [],
  colContentHeader = {},
}: DatasTableType): JSX.Element {
  return (
    <div className="flex flex-col gap-2 h-[160px]">
      <div className="flex justify-between">
        <span className="px-6 font-medium self-end">{header}</span>
        {children}
      </div>
      <Table className="border-collapse min-h-0 overflow-scroll relative">
        <TableHeader className="bg-[#CCCCCC] sticky top-0 ring-1 ring-[#808080]">
          <TableRow>
            {Object.values(colContentHeader).map((cell) => {
              return (
                <TableHead className={styleCell} key={cell}>
                  {cell}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => {
            return (
              <TableRow
                key={d.id}
                onClick={() => {
                  if (rowClick) {
                    rowClick(d.id);
                  }
                }}
                className={
                  !!selectedRow && selectedRow === d.id
                    ? // &&
                      // selectedElementSolution.storeName === storeName
                      "bg-selected"
                    : ""
                }
              >
                {Object.keys(colContentHeader).map((cell) => {
                  // console.log(cell);
                  if (d.hasOwnProperty(cell)) {
                    return (
                      <TableCell className={styleCell} key={cell}>
                        {d[cell]}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell className={styleCell} key={cell}>
                        –
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

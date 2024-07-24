"use client";

import Window from "./Window";
import { ModalBroker } from "./ui/MyModal";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import SolutionTable from "./DataTables/SolutionTable/SolutionTable";
import { useTable } from "../context/TableContext";
import CompositionTable from "./DataTables/CompositionTable/CompositionTable";
import { toast } from "@/components/ui/use-toast";

/**
 * Компонент для отображения растворов и их состава.
 * @returns {JSX.Element} Компонент `Solutions`, который включает в себя таблицы решений и их состава, а также кнопки для синхронизации данных.
 */
export default function SolutionContent(): JSX.Element {
  const {
    solutions, // Получаем массив растворов из контекста таблицы
    compositions, // Получаем массив составов из контекста таблицы
    syncDataFromIndexedDB, // Получаем функцию синхронизации данных с сервером из контекста таблицы
    syncDataFromServer, // Получаем функцию синхронизации данных с IndexedDB из контекста таблицы
  } = useTable();

  /**
   * Обработчик клика для обновления данных из сервера.
   */
  const clickUpdate = async () => {
    try {
      await syncDataFromServer();
      toast({ title: "Обновлено" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  /**
   * Обработчик клика для сохранения данных в IndexedDB.
   */
  const clickUpload = async () => {
    await syncDataFromIndexedDB();
    try {
      toast({ title: "Выгружено" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: `${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Window header="Растворы">
        <div className="flex gap-2">
          {/* Кнопка для обновления данных */}
          <Button
            variant={"outline"}
            onClick={async () => await clickUpdate()}
            className="px-2 py-1 bg-selected"
          >
            Обновить
          </Button>
          {/* Кнопка для сохранения данных */}
          <Button
            variant={"outline"}
            className="px-2 py-1 bg-selected"
            onClick={async () => await clickUpload()}
          >
            Сохранить
          </Button>
        </div>
        <div className="space-y-10 px-4">
          {/* Таблица растворов */}
          <SolutionTable
            header={"Растворы"}
            styleCell="px-1 py-2 h-auto border border-[#808080] text-black"
            data={solutions}
            colContentHeader={{
              titleSolution: "Название",
              valueSolution: "Объем, м3",
            }}
          />
          {/* Таблица состава */}
          <CompositionTable
            header={"Состав"}
            styleCell="p-1 h-auto border border-[#808080] text-black"
            data={compositions}
            colContentHeader={{
              titleComposition: "Компонент",
              valueComposition: "Количество, %",
            }}
          />
        </div>
      </Window>

      {/* Компонент для отображения уведомлений */}
      <Toaster className={"rounded-none bg-xp text-black"} />

      {/* Компонент для отображения модального окна */}
      <ModalBroker
        styleModalContainer={"max-w-[600px] h-min bg-xp rounded-none"}
      />
    </>
  );
}

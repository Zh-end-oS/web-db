"use client";

import { useModal } from "../../ui/MyModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useTable } from "../../../context/TableContext";
import { formSolution, formSolutionType } from "./SolutionValid";

/**
 * Компонент модального окна для создания записи раствора.
 * @returns {JSX.Element} Возвращает компонент `ModalContentCreate`.
 */
export const ModalContentCreate = (): JSX.Element => {
  const { closeModal } = useModal(); // Получаем функцию закрытия модального окна из контекста модального окна
  const { createSolutions } = useTable(); // Получаем функцию создания нового раствора из контекста таблицы

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации.
   */
  const form = useForm<formSolutionType>({
    // Устанавливаем резолвер для валидации формы с использованием zod
    resolver: zodResolver(formSolution),
    // Устанавливаем начальные значения формы
    defaultValues: {
      id: crypto.randomUUID(), // Генерируем уникальный идентификатор для нового раствора
      titleSolution: "",
      valueSolution: 0,
      version: 0,
    },
  });

  /**
   * Функция для создания нового раствора.
   * @param {formSolutionType} values - Значения формы, которые нужно отправить.
   */
  const createSolution = async (values: formSolutionType) => {
    // Дополнительная валидация значений формы
    const validation = formSolution.safeParse(values);
    if (!validation.success) {
      toast({ title: "Форма не прошла валидацию." }); // Выводим сообщение на страницу
      return;
    }

    try {
      await createSolutions(values); // Создание нового раствора
      closeModal(); // Закрытие модального окна
      toast({
        title: "Запись добавлена",
        description: `Название: ${values.titleSolution}, значение: ${values.valueSolution}.`,
      }); // Выводим сообщение на страницу
    } catch (error) {
      toast({
        title: "Ошибка", // Заголовок уведомления об ошибке
        description:
          "Что-то пошло не так, пожалуйста, повторите попытку позже.", // Описание ошибки
        variant: "destructive", // Вариант уведомления (деструктивное)
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createSolution)} className="p-2">
        <div className="space-y-2">
          {/* Заголовки для полей ввода */}
          <div className="grid grid-cols-2 gap-2 items-center ml-1">
            <FormLabel className="col-span-1">Раствор</FormLabel>
            <FormLabel className="col-span-1">Объем, м3</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-2 items-start">
            {/* Поле для ввода названия раствора */}
            <FormField
              control={form.control}
              name="titleSolution"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="ring-1 ring-[#808080] focus-visible:ring-offset-0 focus-visible:ring-1 bg-selected"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Поле для ввода объема раствора */}
            <FormField
              control={form.control}
              name="valueSolution"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="ring-1 ring-[#808080] focus-visible:ring-offset-0 focus-visible:ring-1 bg-selected"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Кнопка для добавления нового раствора */}
        <Button
          variant={"outline"}
          className="px-2 py-1 ring-1 ring-[#808080] bg-selected mt-6"
          onClick={form.handleSubmit(createSolution)}
          disabled={form.formState.isSubmitting}
        >
          Добавить
        </Button>
      </form>
    </Form>
  );
};

/**
 * Компонент модального окна для удаления записи раствора.
 * @returns {JSX.Element} Возвращает компонент `ModalContentDelete`.
 */
export const ModalContentDelete = (): JSX.Element => {
  const { closeModal } = useModal(); // Получаем функцию закрытия модального окна из контекста модального окна
  const {
    selectedElementSolution, // Получаем выбранный элемент из контекста таблицы
    deleteSolutions, // Получаем функцию удаления раствора из контекста таблицы
  } = useTable();

  /**
   * Функция для удаления раствора.
   * Проверяет наличие выбранной записи и выполняет удаление.
   */
  const deleteSolution = async () => {
    try {
      if (!selectedElementSolution) {
        toast({ title: "Выберите запись" }); // Выводим сообщение на страницу
        return;
      }

      await deleteSolutions(selectedElementSolution); // Удаляем расствор
      closeModal(); // Закрытие модального окна
      toast({ title: "Запись удалена" }); // Выводим сообщение на страницу
    } catch (error) {
      closeModal();
      toast({
        title: "Ошибка", // Заголовок уведомления об ошибке
        description:
          "Что-то пошло не так, пожалуйста, повторите попытку позже.", // Описание ошибки
        variant: "destructive", // Вариант уведомления (деструктивное)
      });
    }
  };
  return (
    <div className="p-2 flex flex-col items-center">
      <span>Вы уверены?</span>
      <div>
        {/* Кнопка для подтверждения удаления */}
        <Button
          variant={"outline"}
          className="px-2 py-1 ring-1 ring-[#808080] bg-selected mt-4"
          onClick={() => {
            deleteSolution();
          }}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};

"use client";

import { useModal } from "../../ui/MyModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm } from "react-hook-form";
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
import { formComposition, formCompositionType } from "./CompositionValid";

/**
 * Компонент модального окна изменения состава.
 * Позволяет редактировать состав, добавлять и удалять компоненты.
 * @returns {JSX.Element} Компонент модального окна для изменения состава `ModalContentChange`.
 */
export const ModalContentChange = (): JSX.Element => {
  const {
    closeModal, // Получаем функцию закрытия модального окна из контекста модального окна
    modalData, // Получаем данные модального окна из контекста модального окна
  } = useModal();
  const {
    updateCompositions, // Получаем функцию обновления состава из контекста таблицы
    compositions, // Получаем массив состава из контекста таблицы
  } = useTable();

  /**
   * Инициализация формы с использованием react-hook-form и zod для валидации.
   */
  const form = useForm<formCompositionType>({
    resolver: zodResolver(formComposition), // Устанавливаем резолвер для валидации формы с использованием zod
    mode: "onSubmit", // Режим проверки валидации формы: 'onSubmit' означает, что проверка будет выполняться при отправке формы
    defaultValues: {
      compositions: compositions,
    }, // Устанавливаем начальные значения формы
  });

  // Деструктуризация необходимых функций из useFieldArray
  const { fields, append, remove } = useFieldArray({
    control: form.control, // Передаем контроллер формы, который управляет состоянием полей массива
    name: "compositions", // Название поля, которое представляет собой массив полей в форме
  });

  /**
   * Обработчик для отправки данных формы и обновления состава.
   * @param {formCompositionType} values - Значения формы, которые нужно отправить.
   */
  const createComposition = async (values: formCompositionType) => {
    // Дополнительная валидация значений формы
    const validation = formComposition.safeParse(values);
    if (!validation.success) {
      toast({ title: "Форма не прошла валидацию." }); // Выводим сообщение на страницу
      return;
    }

    try {
      await updateCompositions(values.compositions, modalData); // Обновляем состав в контексте
      closeModal(); // Закрытие модального окна
      toast({ title: "Записи обновлены" }); // Выводим сообщение на страницу
    } catch (error) {
      toast({
        title: "Ошибка", // Заголовок уведомления об ошибке
        description: `Что-то пошло не так, пожалуйста, повторите попытку позже. ${error}`, // Описание ошибки
        variant: "destructive", // Вариант уведомления (деструктивное)
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createComposition)} className="p-2">
        <div className="space-y-2">
          {/* Показ сообщения об ошибке, если есть ошибка в форме */}
          {form.formState.errors.compositions?.root?.message && (
            <div className="mb-4 text-red-500">
              <FormMessage>
                {form.formState.errors.compositions?.root?.message}
              </FormMessage>
            </div>
          )}

          {/* Заголовки столбцов формы */}
          <div className="grid grid-cols-3 gap-2 items-center ml-1">
            <FormLabel className="col-span-1">Компонент</FormLabel>
            <FormLabel className="col-span-1">Количество, %</FormLabel>
          </div>

          {/* Поля для ввода компонентов состава */}
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-2 items-start">
              <FormField
                control={form.control}
                name={`compositions.${index}.titleComposition`}
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
              <FormField
                control={form.control}
                name={`compositions.${index}.valueComposition`}
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

              {/* Кнопка для удаления компонента */}
              <Button
                type="button"
                variant={"outline"}
                className="px-2 py-1 ring-1 ring-[#808080] bg-selected"
                onClick={() => remove(index)}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
        <div className="space-x-2">
          {/* Кнопка для добавления нового компонента */}
          <Button
            type="button"
            variant={"outline"}
            className="px-2 py-1 ring-1 ring-[#808080] bg-selected mt-6"
            onClick={() => {
              append({
                titleComposition: "",
                valueComposition: 0,
                id: crypto.randomUUID(),
                solutionId: modalData,
                version: 0,
              });
              console.log(form.getValues());
            }}
          >
            Добавить еще
          </Button>
          {/* Кнопка для сохранения изменений */}
          <Button
            type="submit"
            variant={"outline"}
            className="px-2 py-1 ring-1 ring-[#808080] bg-selected mt-6"
            disabled={form.formState.isSubmitting}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  );
};

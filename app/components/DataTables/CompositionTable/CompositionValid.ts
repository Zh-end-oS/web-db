import { z } from "zod";

/**
 * Схема валидации для формы состава.
 * Проверяет, что каждый элемент массива содержит корректные данные и что сумма всех значений равна 100.
 */
export const formComposition = z.object({
  compositions: z
    .array(
      z.object({
        // Поле titleComposition - строка с минимальной длиной 2 символа
        titleComposition: z
          .string()
          .min(2, "Название должно содержать минимум 2 символа."),

        // Поле valueComposition - число больше 0 и меньше или равно 100
        valueComposition: z.coerce
          .number()
          .gt(0, "Значение должно быть больше 0.")
          .max(100, "Значение должно быть меньше 100."),

        // Поле id - строка
        id: z.string(),

        // Поле solutionId - строка
        solutionId: z.string(),

        // Поле version - строка
        version: z.number(),
      })
    )
    .refine(
      (compositions) => {
        // Проверка суммы всех значений valueComposition, чтобы сумма была ровно 100
        if (compositions.length > 0) {
          return (
            compositions.reduce(
              (sum, comp) => sum + comp.valueComposition,
              0
            ) === 100
          );
        }
        return true;
      },
      {
        message: "Сумма всех значений должна быть ровно 100.", // Сообщение об ошибке
      }
    ),
});

/**
 * Тип данных формы для состава на основе схемы валидации.
 * Используется для типизации данных, которые должны соответствовать схеме `formComposition`.
 */
export type formCompositionType = z.infer<typeof formComposition>;

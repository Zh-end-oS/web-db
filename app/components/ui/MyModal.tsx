"use client";

import { cn } from "@/lib/utils";
import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { MdOutlineClose } from "react-icons/md";

// Тип данных для модального окна
export type ModalDataType = any;
// Тип данных для содержимого модального окна
export type ModalContentType = ReactElement | null | undefined;
// Тип данных для заголовка модального окна
export type ModalHeaderType = string | null | undefined;

// Тип данных для всех свойств модального окна
export type ModalContentDataType = {
  modalContent?: ModalContentType;
  modalData?: ModalDataType;
  modalHeader?: ModalHeaderType;
};

// Тип данных для стилей модального окна
export type ModalStyleType = {
  styleModalBG?: string;
  styleModalContainer?: string;
  styleModalHeader?: string;
  styleModalContent?: string;
  styleCloseModal?: string;
};

// Тип данных для контекста модального окна
interface ModalContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  modalContent: ModalContentType;

  modalData: ModalDataType;

  modalHeader: ModalHeaderType;

  openModal: (props: ModalContentDataType) => void;
  closeModal: () => void;
}

// Создаем контекст модального окна
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Провайдер для контекста модального окна
 *
 * @param {object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние компоненты, которые будут использовать контекст модального окна.
 *
 * @returns {JSX.Element} Возвращает компонент `ModalProvider`, который оборачивает дочерние компоненты и предоставляет им доступ к контексту модального окна.
 */
const ModalProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  // Состояние для управления видимостью модального окна
  const [isOpen, setIsOpen] = useState(false);

  // Состояние для хранения содержимого модального окна
  const [modalContent, setModalContent] = useState<ModalContentType>(null);

  // Состояние для хранения данных модального окна
  const [modalData, setModalData] = useState<ModalDataType>(null);

  // Состояние для хранения заголовка модального окна
  const [modalHeader, setModalHeader] = useState<ModalHeaderType>(null);

  /**
   * Функция для открытия модального окна.
   * @param {ModalContentDataType} props - Свойства для модального окна.
   */
  const openModal = (props: ModalContentDataType) => {
    const { modalContent, modalData, modalHeader } = props;
    setIsOpen(true); // Устанавливаем состояние модального окна как открытое
    setModalContent(modalContent); // Устанавливаем содержимое модального окна
    setModalData(modalData); // Устанавливаем данные модального окна
    setModalHeader(modalHeader); // Устанавливаем заголовок модального окна
  };

  /**
   * Функция для закрытия модального окна.
   * Сбрасывает все состояния, связанные с модальным окном.
   */
  const closeModal = () => {
    setIsOpen(false); // Устанавливаем состояние модального окна как закрытое
    setModalContent(null); // Сбрасываем содержимое модального окна
    setModalData(null); // Сбрасываем данные модального окна
    setModalHeader(null); // Сбрасываем заголовок модального окна
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        setIsOpen,

        openModal,
        closeModal,

        modalContent,
        modalData,
        modalHeader,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Хук для использования контекста таблицы.
 * @returns {ModalContextType} Контекст таблицы.
 * @throws {Error} Если контекст используется вне провайдера.
 */
const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error(
      "useModal должен использоваться в контексте ModalProvider!"
    );
  }

  return context;
};

/**
 * Компонент для отображения модального окна.
 *
 * @param {ModalStyleType} props - Свойства для стилизации модального окна.
 * @param {string} [props.styleModalBG] - Дополнительные классы для стилизации фона модального окна.
 * @param {string} [props.styleModalContainer] - Дополнительные классы для стилизации контейнера модального окна.
 * @param {string} [props.styleModalHeader] - Дополнительные классы для стилизации заголовка модального окна.
 * @param {string} [props.styleModalContent] - Дополнительные классы для стилизации содержимого модального окна.
 * @param {string} [props.styleCloseModal] - Дополнительные классы для стилизации кнопки закрытия модального окна.
 *
 * @returns {JSX.Element | null} Возвращает элемент модального окна, если оно открыто; иначе `null`.
 */
const ModalBroker = ({ ...props }: ModalStyleType): JSX.Element | null => {
  const {
    closeModal, // Функция для закрытия модального окна.
    modalContent, // Содержимое модального окна, которое будет отображаться внутри модального окна.
    modalData, // Данные, переданные в модальное окно, которые могут использоваться в его содержимом.
    modalHeader, // Заголовок модального окна.
    isOpen, // Логическое значение, определяющее, открыто ли модальное окно в данный момент.
  } = useModal();

  // Если модальное окно не открыто, возвращаем null
  if (!isOpen) return null;

  const {
    styleModalBG,
    styleModalContainer,
    styleModalHeader,
    styleModalContent,
    styleCloseModal,
  } = props;

  return (
    <div
      onMouseDown={closeModal}
      className={cn(
        "fixed w-full h-full left-0 top-0 z-[100] bg-neutral-800/50",
        styleModalBG
      )}
    >
      <div className="w-full h-full flex items-center justify-center">
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className={cn(
            "relative flex flex-col w-full h-full p-2 bg-white text-neutral-800 rounded-md",
            styleModalContainer
          )}
        >
          <div className={cn("w-full flex justify-between", styleModalHeader)}>
            <div className={cn("flex items-center min-w-0 cursor-pointer")}>
              {modalHeader}
            </div>
            <div
              onClick={closeModal}
              className={cn(
                "flex items-center h-[30px] w-[30px] cursor-pointer justify-end",
                styleCloseModal
              )}
            >
              <MdOutlineClose className="h-3/4 w-3/4" />
            </div>
          </div>

          <div className={cn("overflow-y-auto py-2", styleModalContent)}>
            {modalContent && // Если modalContent существует
              React.cloneElement(modalContent, {
                // Клонируем элемент modalContent и передаем ему дополнительные пропсы
                modalData, // Передаем modalData как пропс в клонированный элемент
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { useModal, ModalProvider, ModalBroker };

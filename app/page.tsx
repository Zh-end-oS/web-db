"use client";

import { Dialog } from "@/components/ui/dialog";
import SolutionContent from "./components/SolutionContent";
import { ModalProvider } from "./components/ui/MyModal";
import { TableContextProvider } from "./context/TableContext";

/**
 * Корневой компонент страницы.
 * @returns {JSX.Element} Основной элемент страницы, включающий провайдеры контекста и компонент `Solutions`.
 */
export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <TableContextProvider>
        <ModalProvider>
          <Dialog>
            <SolutionContent />
          </Dialog>
        </ModalProvider>
      </TableContextProvider>
    </main>
  );
}

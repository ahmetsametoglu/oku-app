import { BiArrowBack, BiPrinter } from 'react-icons/bi';
import { Book } from '../../../types/book';

interface TopBarProps {
  book: Book;
  controlsClassName?: string;
  onGoBack: () => void;
}

export const TopBar = ({ book, controlsClassName, onGoBack }: TopBarProps) => {
  const handlePrint = () => {
    const currentImage = document.querySelector('.BookImage img') as HTMLImageElement;
    if (!currentImage) return;

    // iOS için basit bir çözüm
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      const printWindow = window.open(currentImage.src, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } else {
      // Diğer tarayıcılar için iframe çözümü
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      const printDocument = iframe.contentWindow?.document;
      if (!printDocument) return;

      printDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${book.name}</title>
            <style>
              body {
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${currentImage.src}" onload="window.focus(); window.print(); window.close();" />
          </body>
        </html>
      `);
      printDocument.close();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };

  return (
    <div
      className={`${controlsClassName} top-0 mx-2 mt-4 rounded-2xl bg-black/50 px-3 py-2 backdrop-blur-sm sm:mx-4 sm:px-4`}
    >
      <div className="flex items-center justify-between text-white">
        <button
          onClick={onGoBack}
          className="flex items-center rounded-xl bg-white/10 px-3 py-2 text-xs font-medium backdrop-blur-sm transition-opacity hover:bg-white/20 sm:px-4 sm:text-sm"
        >
          <BiArrowBack className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
          Geri
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="truncate text-sm font-medium sm:text-base">{book.name}</h1>
          <button
            onClick={handlePrint}
            className="flex items-center rounded-xl bg-white/10 p-2 text-xs font-medium backdrop-blur-sm transition-opacity hover:bg-white/20 sm:text-sm"
            title="Sayfayı Yazdır"
          >
            <BiPrinter className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

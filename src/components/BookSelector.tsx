import React from 'react';
import {getAllBooks} from '@/data/poems';
import styles from '@/styles/BookPage.module.css';

interface BookSelectorProps {
  currentBookId: string;
  onSelectBook: (bookId: string) => void;
}

export default function BookSelector({ currentBookId, onSelectBook }: BookSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const allBooks = getAllBooks();
  const firstBook = allBooks.length>0 ? allBooks[0] : null;
  const currentBook = allBooks.find(book => book.id === currentBookId) || firstBook;

  // Handle click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Use capture phase to ensure the event is caught
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]); // Add isOpen as dependency to re-establish listener when dropdown state changes

  const handleSelectBook = (bookId: string) => {
    if (bookId !== currentBookId) {
      onSelectBook(bookId);
    }
    setIsOpen(false);
  };

  // Stop propagation to prevent immediate closing on button click
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (!currentBook) return null;

  return (
    <div className={styles.bookSelectorContainer} ref={dropdownRef}>
      <button 
        className={styles.bookSelectorButton} 
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        type="button"
      >
        <span className={styles.bookIcon}>📚</span>
        {currentBook.title}
        <span className={styles.dropdownArrow}>▾</span>
      </button>

      {isOpen && (
        <div 
          className={styles.bookDropdown} 
          role="listbox"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
        >
          {allBooks.map(book => (
            <div 
              key={book.id}
              className={`${styles.bookOption} ${book.id === currentBookId ? styles.selected : ''}`}
              onClick={() => handleSelectBook(book.id)}
              role="option"
              aria-selected={book.id === currentBookId}
            >
              <div className={styles.bookTitle}>{book.title}</div>
              <div className={styles.bookDescription}>{book.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

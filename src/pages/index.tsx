import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Page from '@/components/Page';
import InfoModal from '@/components/InfoModal';
import { getAllBooks, Book, Poem } from '@/data/poems';
import { clamp } from '@/utils/illustrations';
import { initPageTurnSound, playPageTurnSound } from '@/utils/sound';
import styles from '@/styles/BookPage.module.css';
import BookSelector from "@/components/BookSelector";
import BookTitle from "@/components/BookTitle";
import {Utility} from "@/utils/utility";

export default function Home() {
  const [pageIndex, setPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const allBooks = getAllBooks();
    const firstBook = allBooks.length>0 ? allBooks[0] : allBooks[0];
    const [currentBookId, setCurrentBookId] = useState<string>(firstBook.id);
  const [currentBook, setCurrentBook] = useState<Book>(firstBook);
  const [poems, setPoems] = useState<Poem[]>(firstBook.poems);

  // Book container ref for flipping animation
  const bookRef = React.useRef<HTMLDivElement>(null);

  // Update book and poems when currentBookId changes
  useEffect(() => {
    const book = allBooks.find(b => b.id === currentBookId) || firstBook;
    setCurrentBook(book);
    setPoems(book.poems);
    setPageIndex(0); // Reset to first page when changing books
  }, [currentBookId]);

  useEffect(() => {

      // Initialize page turn sound immediately and on interactions
    initPageTurnSound();

    // Add additional triggers for sound initialization on different interaction types
    const reinitSound = () => {
      initPageTurnSound();
    };

    // Add multiple event types to catch any user interaction
    document.addEventListener('click', reinitSound);
    document.addEventListener('touchend', reinitSound);
    document.addEventListener('keydown', reinitSound);

    // Check for saved preferences
    if (typeof window !== 'undefined') {
      // Theme preference
      if (localStorage.getItem('theme') === 'dark') {
        setIsDarkTheme(true);
        document.body.classList.add('dark-theme');
      }

      // Book selection
      const savedBookId = localStorage.getItem('selectedBookId');
      if (savedBookId && allBooks.some(book => book.id === savedBookId)) {
        setCurrentBookId(savedBookId);
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipTo(pageIndex + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipTo(pageIndex - 1);
      }

      // Number keys for quick book selection (1-9)
      const keyNum = parseInt(e.key);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= allBooks.length) {
        handleSelectBook(allBooks[keyNum - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Update document title based on current poem
    if (poems.length > 0 && pageIndex < poems.length) {
      document.title = `${poems[pageIndex].title} — ${currentBook.title}`;
    }

    // Add touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next page
        flipTo(pageIndex + 1);
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous page
        flipTo(pageIndex - 1);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('click', reinitSound);
      document.removeEventListener('touchend', reinitSound);
      document.removeEventListener('keydown', reinitSound);
    };
  }, [pageIndex, currentBook, poems]);

  const handleSelectBook = (bookId: string) => {
    if (currentBookId !== bookId) {
      setCurrentBookId(bookId);
      localStorage.setItem('selectedBookId', bookId);
    }
  }

  const flipTo = (nextIndex: number) => {
    if (poems.length === 0) return;
    nextIndex = clamp(nextIndex, 0, poems.length - 1);
    if (nextIndex === pageIndex) return;

    // Determine flip direction
    const isForward = nextIndex > pageIndex;
    const flipClass = isForward ? styles.flippingRight : styles.flippingLeft;

    // Start flip animation
    setIsFlipping(true);

    // Play page turn sound immediately to avoid delay issues
    playPageTurnSound();

    // Apply visual animation

    // Add flip class to book
    if (bookRef.current) {
      bookRef.current.classList.add(flipClass);
    }

    // Animate the hint
    const hint = document.getElementById('hint');
    if (hint) {
      hint.style.animation = 'none';
      setTimeout(() => hint.style.animation = 'pulse 3s infinite', 10);
    }

    // After half-time change the page index
    setTimeout(() => {
      setPageIndex(nextIndex);
    }, 350);

    // End flipping class after animation
    setTimeout(() => {
      if (bookRef.current) {
        bookRef.current.classList.remove(flipClass);
      }
      setIsFlipping(false);

      // Briefly add a settled class for a subtle settling effect
      if (bookRef.current) {
        bookRef.current.classList.add(styles.settled);
        setTimeout(() => {
          bookRef.current?.classList.remove(styles.settled);
        }, 200);
      }
    }, 700);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', !isDarkTheme ? 'dark' : 'light');
  };

  // Safely get poems based on index
  const leftPoem = pageIndex > 0 && pageIndex - 1 < poems.length ? poems[pageIndex - 1] : null;
  const rightPoem = pageIndex < poems.length ? poems[pageIndex] : null;

  return (
    <>
      <Head>
        <title>
          {poems.length > 0 && pageIndex < poems.length
            ? `${poems[pageIndex].title} — ${currentBook.title}`
            : 'কাব্য-পুস্তিকা — Bangla Poetry Book'}
        </title>
      </Head>
      <div className={styles.center}>
        <div className={styles.bookWrap} id="bookWrap">
            {/* Book selection controls outside the book */}
            <div className={styles.bookControls}>
                {/* Book Selector Dropdown */}
                <BookSelector
                    currentBookId={currentBookId}
                    onSelectBook={handleSelectBook}
                />

                {/* Book Title Header */}
                <BookTitle book={currentBook} />
            </div>

          <div className={styles.book} ref={bookRef} id="book">
            {/* Left page */}
            <Page 
              poem={leftPoem} 
              pageIndex={pageIndex} 
              isLeft={true} 
              onPageClick={() => flipTo(pageIndex - 1)} 
            />

            {/* Right page */}
            <Page 
              poem={rightPoem} 
              pageIndex={pageIndex + 1} 
              isLeft={false} 
              onPageClick={() => flipTo(pageIndex + 1)} 
            />
          </div>

          <div className={styles.spine} aria-hidden="true"></div>

          <div className={styles.controls} style={{ marginTop: '20px' }}>
            <button 
              className={`${styles.button} ${styles.btnGhost}`} 
              onClick={() => flipTo(pageIndex - 1)}
              disabled={pageIndex <= 0}
              style={{ opacity: pageIndex <= 0 ? '0.6' : '1' }}
            >
              ← পূর্ব
            </button>
            <div className={styles.pagecount}>
              {Utility.translateNumber((pageIndex + 1).toString())} / {Utility.translateNumber(poems.length.toString())}
            </div>
            <button 
              className={styles.button}
              onClick={() => flipTo(pageIndex + 1)}
              disabled={pageIndex >= poems.length - 1}
              style={{ opacity: pageIndex >= poems.length - 1 ? '0.6' : '1' }}
            >
              পরবর্তী →
            </button>
          </div>

          <div className={styles.hint} id="hint">
              পৃষ্ঠা উল্টাতে ← → বোতাম চাপুন — অথবা পৃষ্ঠার পাশের অংশে স্পর্শ করুন
          </div>

          <div className={styles.footer}>
            <div className="footer-text">কালি ও কবিতা — একটি পূর্ণ বাংলা ভাষার কবিতার মঞ্চ </div>
            <div className="footer-separator">•</div>
            <div className={styles.footerLink} onClick={toggleTheme}> আলো আধারের চেহারা বদল</div>
            <div className="footer-separator">•</div>
            <div className={styles.footerLink} onClick={() => setIsModalOpen(true)}>জানুন</div>
          </div>

          <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    </>
  );
}

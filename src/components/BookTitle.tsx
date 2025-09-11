import React from 'react';
import { Book } from '@/data/poems';
import styles from '@/styles/BookPage.module.css';

interface BookTitleProps {
  book: Book;
}

export default function BookTitle({ book }: BookTitleProps) {
  if (!book) return null;

  return (
    <div className={styles.bookTitleHeader}>
      <h1 className={styles.bookMainTitle}>{book.title}</h1>
      <div className={styles.bookSubtitle}>
        {book.author && <span>{book.author}</span>}
        {book.author && book.year && <span className={styles.separator}>•</span>}
        {book.year && <span>{book.year}</span>}
      </div>
      <div className={styles.bookDescription}>{book.description}</div>
    </div>
  );
}

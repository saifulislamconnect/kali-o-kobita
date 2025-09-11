import React from 'react';
import styles from '@/styles/BookPage.module.css';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  // Handle click outside the modal content to close
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalClass = `${styles.modal} ${isOpen ? styles.modalVisible : ''}`;

  return (
    <div className={modalClass} onClick={handleModalClick}>
      <div className={styles.modalContent}>
        <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        <h3>আমার প্রচেষ্টা সম্পর্কে জানুন</h3>
        <p>কালি-ও-কবিতা বাংলা ভাষায় লিখিত সবসময়ের সুন্দর হৃদয়গ্রাহী কবিতার আধুনিক সংকলন। </p>
        <p>উপরের অংশে বইয়ের তালিকা রয়েছে, সেখান থেকে পছন্দের বইটি খুঁজে নিন। বই পছন্দ করা হয়ে গেলে পৃষ্ঠার পার্শ্ববর্তী অংশে চাপ দিয়ে পূর্বের অথবা পরের পৃষ্ঠায় যেতে পারবেন। আপনি চাইলে কী-বোর্ডের তীর চিহ্নিত বোতাম চেপেও পৃষ্ঠা বদলাতে পারবেন।</p>
        <p>বাংলা ভাষা এবং সাহিত্যের প্রতি অগাধ ভালবাসা থেকে এ প্রয়াস। তোমার কিছুটা সময় ভালো কাটুক।</p>
          <br/>
          <small>- সা. ই. রুদ্রনীল</small>
      </div>
    </div>
  );
}

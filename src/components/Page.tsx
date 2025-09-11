import React from 'react';
import { makeIllustrationSVG } from '@/utils/illustrations';
import styles from '@/styles/BookPage.module.css';
import { Poem } from '@/data/poems';
import { Utility } from '@/utils/utility'

interface PageProps {
  poem: Poem | null;
  pageIndex: number;
  isLeft: boolean;
  onPageClick: () => void;
}

export default function Page({
  poem,
  pageIndex,
  isLeft,
  onPageClick
}: PageProps) {
  const pageRef = React.useRef<HTMLDivElement>(null);
    const [isClient, setIsClient] = React.useState(false);

React.useEffect(() => {
    setIsClient(true);
}, []);
  const pageClass = [
    styles.page,
    isLeft ? styles.left : styles.right,
    !poem ? styles.empty : '',
  ].filter(Boolean).join(' ');

  if (!poem) {
    return <div ref={pageRef} className={pageClass} onClick={onPageClick}></div>;
  }

  // Format current date for display
  const now = new Date();
  const formattedDate = isClient ? now.toLocaleString() : "12/12/2023, 12:00:00 AM"

  const translatedPageIndex = Utility.translateNumber(pageIndex.toString());
const translatedDate = Utility.translateNumber(formattedDate).replaceAll('AM', 'সকাল').replaceAll('PM', "বিকাল");
  return (
    <div ref={pageRef} className={pageClass} onClick={onPageClick}>
      <div>
        <div className={styles.headerTitle}>{poem.title}</div>
        {poem.author && (
          <div className={styles.poemAuthor}>— {poem.author}</div>
        )}
        <div className={styles.poemLines}>
          {poem.lines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < poem.lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>

          <div className={styles.illustration}
               dangerouslySetInnerHTML={{ __html: makeIllustrationSVG(poem.seed) }}
               aria-hidden="true" />
        <div className={styles.meta}>
          <span>পৃষ্ঠা {translatedPageIndex}</span>
          <span>{translatedDate}</span>
        </div>
      </div>
    </div>
  );
}

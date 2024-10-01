import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { NewsContext } from '../context/NewsContext';
import debounce from 'lodash/debounce';
import Skeleton from './Skeleton';
import html2canvas from 'html2canvas';
import { FaShareAlt } from "react-icons/fa";

const NewsList = ({ language, onScroll }) => {
  const { news, setNews, nextPage, setNextPage, scrollPosition, setScrollPosition } = useContext(NewsContext);
  const [loading, setLoading] = useState(false);
  const [usePrimaryApi, setUsePrimaryApi] = useState(true);
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPosition;
      }
    }
  }, [location.pathname, scrollPosition]);

  useEffect(() => {
    const fetchNews = async () => {
      const baseUrl = usePrimaryApi
        ? 'https://backendpoints.vercel.app/telugu/news'
        : 'https://backendpoints.vercel.app/telugutwo/news';
      const url = language === 'telugu'
        ? `${baseUrl}`
        : 'https://backendpoints.vercel.app/english/news';

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setNews(data.results);
        setNextPage(data.nextPage);
        localStorage.setItem('nextPage', data.nextPage);
        localStorage.setItem('nextPageTimestamp', new Date().toLocaleString());
      } catch (error) {
        console.error('Error fetching news:', error);
        if (language === 'telugu') {
          setUsePrimaryApi((prev) => !prev);
        }
      }
    };

    if (news.length === 0) {
      fetchNews();
    }
  }, [language, news.length, setNews, setNextPage, usePrimaryApi]);

  const loadMore = async () => {
    if (!nextPage || loading) return;

    setLoading(true);
    const baseUrl = usePrimaryApi
      ? `https://backendpoints.vercel.app/telugu/news?page=${nextPage}`
      : `https://backendpoints.vercel.app/telugutwo/news?page=${nextPage}`;
    const url = language === 'telugu'
      ? baseUrl
      : `https://backendpoints.vercel.app/english/news?page=${nextPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setNews([...news, ...data.results]);
      setNextPage(data.nextPage);
      localStorage.setItem('nextPage', data.nextPage);
      localStorage.setItem('nextPageTimestamp', new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading more news:', error);
      if (language === 'telugu') {
        setUsePrimaryApi((prev) => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  const prefetchNextPage = async () => {
    if (!nextPage || loading) return;

    setLoading(true);
    const baseUrl = usePrimaryApi
      ? `https://backendpoints.vercel.app/telugu/news?page=${nextPage}`
      : `https://backendpoints.vercel.app/telugutwo/news?page=${nextPage}`;
    const url = language === 'telugu'
      ? baseUrl
      : `https://backendpoints.vercel.app/english/news?page=${nextPage}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setNews([...news, ...data.results]);
      setNextPage(data.nextPage);
      localStorage.setItem('nextPage', data.nextPage);
      localStorage.setItem('nextPageTimestamp', new Date().toLocaleString());
    } catch (error) {
      console.error('Error prefetching next page:', error);
      if (language === 'telugu') {
        setUsePrimaryApi((prev) => !prev);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (news.length > 0 && news.length % 9 === 0) {
      prefetchNextPage();
    }
  }, [news.length]);

  const handleScroll = debounce(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setScrollPosition(scrollTop);
      const buffer = 500;
      if (scrollTop + clientHeight >= scrollHeight - buffer) {
        loadMore();
      }
      onScroll(scrollTop);
    }
  }, 100);

  const fallbackImage = '/alternate.jpg';

  const invalidImages = [
    'https://www.andhrajyothy.com/assets/images/defaultImg.jpeg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-01-784x441.jpg',
    'https://static.india.com/wp-content/themes/icom/images/default-big.svg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-01-380x214.jpg',
    'https://st1.latestly.com/wp-content/uploads/2018/03/default-img-02-380x214.jpg',
    'https://img.theweek.in/content/dam/week/wire-updates/the-week-pti-wire-updates.jpg',
    'https://media.andhrajyothy.com/media/2024/20240727/Breaking_News_62adeb0dfa_v_jpg.webp',
    'https://www.thehindu.com/theme/images/th-online/1x1_spacer.png',
    'https://static.toiimg.com/thumb/msid-47529300,imgsize-110164,width-400,height-225,resizemode-72/47529300.jpg',
    'https://images.hindustantimes.com/default/1600x900.jpg'
  ];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const truncateDescription = (description) => {
    if (!description) return '';
    if (description.length > 380) {
      return description.slice(0, 350) + '...';
    }
    return description;
  };

  const isValidDescription = (description) => {
    return description && description.split(' ').length > 10;
  };

  const formatDate = (pubDate) => {
    const date = new Date(pubDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleShare = async (article) => {
    const container = document.getElementById(`article-${article.article_id}`);
    if (!container) return;

    try {
      const images = container.querySelectorAll('img');
      const promises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      });

      await Promise.all(promises);

      const watermark = document.createElement('div');
      watermark.style.position = 'absolute';
      watermark.style.top = '10px';
      watermark.style.left = '10px';
      watermark.style.color = 'black';
      watermark.style.fontSize = '24px';
      watermark.style.fontWeight = 'bold';
      watermark.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
      watermark.textContent = '3Lok News';
      container.appendChild(watermark);

      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: false,
      });
      const image = canvas.toDataURL('image/jpeg');

      const blob = await (await fetch(image)).blob();
      const file = new File([blob], `article-${article.article_id}.jpg`, { type: 'image/jpeg' });

      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: truncateDescription(article.description),
          files: [file],
        });
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          title: article.title,
          description: truncateDescription(article.description),
          imageUrl: article.imageUrl
        }));
      }

      container.removeChild(watermark);
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const calculateImageHeight = (title, description) => {
    const titleHeight = title.length * 0.5;
    const descriptionHeight = description.length * 0.2;
    const totalHeight = titleHeight + descriptionHeight;

    if (totalHeight < 120) {
      return 'h-[40%]';
    }  else {
      return `h-[${50 - (totalHeight / 10)}%]`;
    }
  };

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll" >
      {news.length === 0 ? (
        <Skeleton />
      ) : (
        news.map(article => {
          if (!isValidDescription(article.description)) return null;

          const isValidImageUrl = article.image_url && !invalidImages.includes(article.image_url);
          const imageHeightClass = calculateImageHeight(article.title, article.description);

          return (
            <div key={article.article_id} id={`article-${article.article_id}`} className="mb-4 shadow-2xl py-2 px-2 rounded-lg flex flex-col relative mx-2 mt-4" style={{ scrollSnapAlign: 'start' }}>
              <img
                className={`w-full h-52 object-cover `}
                src={isValidImageUrl ? article.image_url : fallbackImage}
                alt={article.title}
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}

              />
              <p className="text-xs text-gray-600 absolute  right-0  bg-white w-20 rounded-sm py-2  px-4">{formatDate(article.pubDate)}</p>
              <div className='px-2'>
                <h2 className="text-lg text-black font-semibold mt-2">{article.title}</h2>
                <p className="text-lg text-gray-800 mt-1 overflow-hidden leading-8">{truncateDescription(article.description)}</p>
              </div>
              <div className='flex justify-between'>
              <a href={article.link} target="_blank" rel="noopener noreferrer" className=" left-1 p-2 text-blue-700">{article.source_name}</a>
              <button
                onClick={() => handleShare(article)}
                className=" bottom-4 right-4 p-2 text-blue-700 text-lg "
              >
                <FaShareAlt />
              </button>
              </div>
            </div>
          );
        })
      )}
      {loading && <div className="text-center p-4">Loading...</div>}
    </div>
  );
};

export default NewsList;

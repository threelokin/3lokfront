import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const NewsDetailPage = () => {
  const [newsDetail, setNewsDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const url = searchParams.get('url');

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch('https://backendpoints.vercel.app/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: `https://www.andhrajyothy.com${url}` }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        setNewsDetail(data);
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [url]);

  if (loading) {

    return (
        <div className="flex items-center justify-center h-screen">
        <div className="text-center "><div className="text-xl font-bold">Loading...</div>
        </div></div>);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold">Sorry This page is not available right now.</h1>
          <h1 className="text-xl font-bold">Our AI is under development</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 my-14">
      <h1 className="text-3xl font-bold mb-4">{newsDetail.title}</h1>
      <img src={newsDetail.image} alt={newsDetail.title} className="w-full h-64 object-cover mb-4 rounded-lg" />
      <div className="prose">
        <p>{newsDetail.content}</p>
      </div>
    </div>
  );
};

export default NewsDetailPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const [telanganaNews, setTelanganaNews] = useState([]);
  const [andhraPradeshNews, setAndhraPradeshNews] = useState([]);
  const [englishNews, setEnglishNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'english';

  useEffect(() => {
    const fetchNews = async (categoryId, setNews) => {
      try {
        const response = await fetch(`https://backendpoints.vercel.app/latestnewstelugu?categoryId=${categoryId}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching Telugu news:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnglishNews = async () => {
      try {
        const response = await fetch('https://backendpoints.vercel.app/latestnewsenglish');
        const data = await response.json();
        setEnglishNews(data);
      } catch (error) {
        console.error('Error fetching English news:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    if (language === 'telugu') {
      fetchNews(2, setTelanganaNews);
      fetchNews(1, setAndhraPradeshNews);
    } else if (language === 'english') {
      fetchEnglishNews();
    }
  }, [language]);

  const handleClick = (url) => {
    navigate(`/ainews?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className='my-20'>
      <h1 className='text-lg font-bold mx-4'>AI Latest news</h1>
      {loading ? (
       <div className="flex items-center justify-center h-screen">
       <div className="text-center "><div className="text-xl font-bold">Loading...</div>
       </div></div>
      ) : (
        <>
          {language === 'telugu' && (
            <>
              <div>
                <h2 className='text-xl font-bold mb-1 mx-4 mt-4'>తెలంగాణ</h2>
                <div className="flex overflow-x-scroll p-4 space-x-4">
                  {telanganaNews.map((item, index) => (
                    <div
                      key={index}
                      className="flex-none w-64 cursor-pointer"
                      onClick={() => handleClick(item.url)}
                    >
                      <img src={item.imageUrl} alt={item.headline} className="w-full h-48 object-cover rounded-lg" />
                      <h2 className="text-lg font-bold mt-2">{item.headline}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className='text-xl font-bold mb-1 mt-4 mx-4'>ఆంధ్రప్రదేశ్</h2>
                <div className="flex overflow-x-scroll p-4 space-x-4">
                  {andhraPradeshNews.map((item, index) => (
                    <div
                      key={index}
                      className="flex-none w-64 cursor-pointer"
                      onClick={() => handleClick(item.url)}
                    >
                      <img src={item.imageUrl} alt={item.headline} className="w-full h-48 object-cover rounded-lg" />
                      <h2 className="text-lg font-bold mt-2">{item.headline}</h2>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {language === 'english' && (
            <div>
              <h2 className='text-xl font-bold mb-1 mx-4 mt-4'></h2>
              <div className="flex overflow-x-scroll p-4 space-x-4">
                {englishNews.map((item, index) => (
                  <div
                    key={index}
                    className="flex-none w-64 cursor-pointer"
                    onClick={() => handleClick(item.url)}
                  >
                    <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded-lg" />
                    <h2 className="text-lg font-bold mt-2">{item.title}</h2>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Discovery;

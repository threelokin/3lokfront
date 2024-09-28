import React from 'react';
import NewsList from '../components/NewsList';

const Home = ({ language }) => {
  return (
    <div className="h-screen">
      <NewsList language={language} />
    </div>
  );
};

export default Home;

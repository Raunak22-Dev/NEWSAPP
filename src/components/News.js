import React, { useEffect, useState, useCallback } from 'react';
import NewItem from './NewItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import './News.css';

const News = ({ country = 'in', pageSize = 9, category = 'general', apiKey, setProgress }) => {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [page, setPage] = useState(1); 
  const [totalResults, setTotalResults] = useState(0); 
  const [stopFetching, setStopFetching] = useState(false); 
  const [error, setError] = useState(null); // State for handling errors

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = useCallback(async () => {
    setProgress?.(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize * 2}`;

    setLoading(true);
    setError(null); // Reset error state
    try {
      let data = await fetch(url);
      setProgress?.(50);

      let parsedData = await data.json();
      setProgress?.(70);
      
      if (parsedData.status !== 'ok') {
        setError(parsedData.message); // Set error message
        return;
      }
      setProgress?.(100);

      const validArticles = parsedData.articles?.filter((article) => article.description) || [];
      setArticles((prevArticles) => [...prevArticles, ...validArticles]);
      setTotalResults(parsedData.totalResults);
      
      if (validArticles.length < pageSize) {
        setStopFetching(true);
      }
    } catch (error) {
      setError("Fetch failed. Please try again."); // Set error message
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [country, category, apiKey, pageSize, page, setProgress]);

  useEffect(() => {
    updateNews();
  }, [updateNews]);

  const fetchMoreData = () => {
    if (stopFetching) return;
    setPage((prevPage) => prevPage + 1);
  };

  const uniqueArticles = articles.filter((article, index, self) =>
    index === self.findIndex((t) => t.url === article.url)
  );
  const hasMoreArticles = uniqueArticles.length < totalResults && !stopFetching;
  return (
    <div className="container my-3">
      <h2 style={{ marginTop: '60px' }}>Top Headlines - {capitalizeFirstLetter(category)}</h2>

      {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}

      <InfiniteScroll
        dataLength={uniqueArticles.length}
        next={fetchMoreData}
        hasMore={uniqueArticles.length < totalResults && !stopFetching}
        loader={loading && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {uniqueArticles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewItem
                  title={element.title ? element.title.slice(0, 39) : ''}
                  description={element.description ? element.description.slice(0, 88) : ''}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>

      {!hasMoreArticles && uniqueArticles.length > 0 && (
        <div className="text-center mt-4">
          <h4>That's all for today!</h4>
        </div>
      )}
    </div>
  );
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  setProgress: PropTypes.func,
};

export default News;

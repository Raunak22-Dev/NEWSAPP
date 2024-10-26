import React, { Component } from 'react';
import NewItem from './NewItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";
import './News.css';

export default class News extends Component {
  static defaultProps = {
    country: 'us',
    pageSize: 9,
    category: 'general',
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      stopFetching: false,
    };
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - QuickNews`;
  }

  async updateNews() {
    this.props.setProgress?.(10); // Optional chaining to avoid error if setProgress is not passed as a prop
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize * 2}`;
    this.setState({ loading: true });

    try {
      let data = await fetch(url);
      this.props.setProgress?.(50);

      let parsedData = await data.json();
      this.props.setProgress?.(70);
      
      if (parsedData.status !== 'ok') {
        console.error("Error fetching news:", parsedData.message);
        this.setState({ loading: false });
        return;
      }
      this.props.setProgress?.(100);
      
      const validArticles = parsedData.articles?.filter((article) => article.description) || [];
      
      this.setState({
        articles: validArticles.slice(0, this.props.pageSize),
        totalResults: parsedData.totalResults,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch failed:", error);
      this.setState({ loading: false });
    }
  }


  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    if (this.state.stopFetching) return; // Stop fetching if already stopped

    this.setState({ page: this.state.page + 1, loading: true });

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize * 2}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();

      if (parsedData.status !== 'ok') {
        console.error("Error fetching news:", parsedData.message);
        this.setState({ loading: false });
        return;
      }

      const validArticles = parsedData.articles?.filter((article) => article.description) || [];

      if (validArticles.length === 0) {
        this.setState({
          stopFetching: true,
          loading: false,
        });
        return;
      }

      this.setState({
        articles: [...this.state.articles, ...validArticles.slice(0, this.props.pageSize)],
        totalResults: parsedData.totalResults,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch failed:", error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { articles, totalResults, loading, stopFetching } = this.state;
  
    // Check if there are more articles to load
    const hasMoreArticles = articles.length < totalResults && !stopFetching;
  
    // Filter unique articles based on URL
    const uniqueArticles = articles.filter((article, index, self) =>
      index === self.findIndex((t) => t.url === article.url)
    );
  
    return (
      <div className="container my-3">
        <h2>Top Headlines - {this.capitalizeFirstLetter(this.props.category)}</h2>
  
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={hasMoreArticles}
          loader={loading && <Spinner />}
        >
          <div className="container">
            <div className="row">
              {uniqueArticles.map((element, index) => (
                <div className="col-md-4" key={`${element.url}-${index}`}>
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
  
        {/* Display "That's all for today!" only when no more articles to load and some articles have been fetched */}
        {!hasMoreArticles && articles.length > 0 && (
          <div className="text-center mt-4">
            <h4>That's all for today!</h4>
          </div>
        )}
      </div>
    );
  }
  
}

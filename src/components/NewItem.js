import React, { Component } from 'react';

export class NewItem extends Component {
  render() {
    let { title, description, imageUrl, newsUrl, author, date, source } = this.props;

    return (
      <div className="my-3">
        <div className="card h-100 shadow-sm" style={{ transition: 'transform 0.3s' }}>
          <img
            src={
              !imageUrl
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysCM2-UtgWTDqGCw4JkC4wBiBXX9RpWHycLIzQiYnnm0lXaie7D_yd0s&s'
                : imageUrl
            }
            className="card-img-top"
            alt="..."
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <div className="card-body">
            <h5 className="card-title">
              {title ? title : 'Untitled'}...
            </h5>
            <p className="card-text">{description ? description : 'No description available'}...</p>
            <p className="card-text">
              <small className="text-body-secondary">
                Source: {source ? source : 'Unknown'}
              </small>
            </p>
            <p className="card-text">
              <small className="text-body-secondary">
                By {!author ? 'Unknown' : author} on {new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
              </small>
            </p>
            <a
              href={newsUrl}
              rel="noreferrer"
              target="_blank"
              className="btn btn-sm btn-primary"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewItem;

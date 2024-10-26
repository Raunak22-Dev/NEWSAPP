import React from 'react';
import PropTypes from 'prop-types';

const NewItem = (props) => {
    const { title, description, imageUrl, newsUrl, author, date, source } = props;

    let formattedDate = 'Date not available';
    if (date) {
        try {
            formattedDate = new Date(date).toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: 'numeric' 
            });
        } catch (error) {
            console.error('Invalid date format:', error);
        }
    }

    return (
        <div className="my-3">
            <div className="card h-100 shadow-sm" style={{ transition: 'transform 0.3s' }}>
                <img
                    src={imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysCM2-UtgWTDqGCw4JkC4wBiBXX9RpWHycLIzQiYnnm0lXaie7D_yd0s&s'}
                    className="card-img-top"
                    alt={title ? title : 'News Image'}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                    <h5 className="card-title">
                        {title || 'Untitled'}...
                    </h5>
                    <p className="card-text">{description || 'No description available'}...</p>
                    <p className="card-text">
                        <small className="text-body-secondary">
                            Source: {source || 'Unknown'}
                        </small>
                    </p>
                    <p className="card-text">
                        <small className="text-body-secondary">
                            By {author || 'Unknown'} on {formattedDate}
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
};

NewItem.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
    newsUrl: PropTypes.string.isRequired, // Essential prop
    author: PropTypes.string,
    date: PropTypes.string, // ISO date string
    source: PropTypes.string,
};

export default NewItem;

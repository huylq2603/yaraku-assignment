import React from 'react';
import ReactDOM from 'react-dom';
import BookPage from './pages/BookPage';

function ReactApp() {
    return (
        <div className="react-app container">
            <BookPage />
        </div>
    );
}

export default ReactApp;

if (document.getElementById('react-app')) {
    ReactDOM.render(<ReactApp />, document.getElementById('react-app'));
}

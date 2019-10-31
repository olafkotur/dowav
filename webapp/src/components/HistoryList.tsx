import React from 'react';

const HistoryList: React.FC = () => {
    return (
        <div className="history-list">
            {[1, 2, 3, 4, 5, 6].map(d => (
                <li>{d}</li>
            ))}
        </div>
    );
};

export default HistoryList;

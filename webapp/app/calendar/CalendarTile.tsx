import React from 'react';

interface TileContentProps {
  date: Date;
}

const TileContent: React.FC<TileContentProps> = ({ date }) => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className="card rounded-sm calendar-tile" onClick={handleClick}>
      <div className="card-header">{date.getDate()}</div>
      <div className='card-body h-48'>
        Activity on {date.toDateString()}
      </div>
    </div>
  );
};

export default TileContent;
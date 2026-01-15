'use client';

import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Cargando mapa...</p>
    </div>
  ),
});

const MapWrapper = ({ properties, onBoundsChange, zoom, showPopup = true }) => {
  return <DynamicMap properties={properties} onBoundsChange={onBoundsChange} zoom={zoom} showPopup={showPopup} />;
};

MapWrapper.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object),
  onBoundsChange: PropTypes.func,
  zoom: PropTypes.number,
  showPopup: PropTypes.bool,
};

MapWrapper.defaultProps = {
  properties: [],
  onBoundsChange: null,
  zoom: 13,
  showPopup: true,
};

export default MapWrapper;

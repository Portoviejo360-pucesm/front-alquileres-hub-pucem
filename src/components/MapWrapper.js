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

const MapWrapper = ({ properties }) => {
  return <DynamicMap properties={properties} />;
};

MapWrapper.propTypes = {
  properties: PropTypes.arrayOf(PropTypes.object),
};

MapWrapper.defaultProps = {
  properties: [],
};

export default MapWrapper;

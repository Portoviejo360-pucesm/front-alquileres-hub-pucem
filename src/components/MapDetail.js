'use client';

import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

const DynamicMapDetail = dynamic(() => import('./MapDetailComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
      <div className="text-center">
        <div className="spinner"></div>
        <p className="text-gray-600 mt-3">Cargando ubicación...</p>
      </div>
    </div>
  ),
});

const MapDetail = ({ lat, lng, title, address }) => {
  return <DynamicMapDetail lat={lat} lng={lng} title={title} address={address} />;
};

MapDetail.propTypes = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  title: PropTypes.string,
  address: PropTypes.string,
};

MapDetail.defaultProps = {
  title: 'Ubicación de la propiedad',
  address: '',
};

export default MapDetail;

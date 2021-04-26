let BASE_URL = 'https://dev-api.avendi.me/barranca/api';

if (process.env.REACT_APP_ENV === 'local') {
  BASE_URL = 'http://localhost:5004/barranca/api';
}

export default BASE_URL;

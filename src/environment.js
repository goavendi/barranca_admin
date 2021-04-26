let BASE_URL = 'https://dev-api.avendi.me/barranca/api';

if (process.env.REACT_APP_ENV === 'local') {
  BASE_URL = 'http://localhost:4000/api';
}

export default BASE_URL;

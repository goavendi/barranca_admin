/*...subdomain check function...*/
// const isSubdomain = (url) => {
//   url = url || 'http://www.test-domain.com'; // just for the example
//   var regex = new RegExp(/^([a-z]+\/{2})?([\w-]+\.[\w-]+\.\w+)$/);
//   return !!url.match(regex); // make sure it returns boolean
// };

const tenantName = process.env.REACT_APP_TENANT_NAME || 'avendi';

export const getTanant = () => {
  return tenantName;
  //   let subdomain;
  //   let host = window.location.host;
  //   if (isSubdomain(host)) {
  //     subdomain = host.split('.')[0];
  //   } else {
  //     // console.warn(
  //     //   "SUBDOMAIN not exist. Using default 'avendi' sub domain",
  //     //   "$$$$"
  //     // );
  //     subdomain = 'avendi';
  //   }
  //   return subdomain;
};

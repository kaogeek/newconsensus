// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  facebookAppId: 768184130301933, // default is 768184130301933
  // apiBaseURL: "https://api.newconsensus.in.th/api"
  // apiBaseURL: 'https://localhost:9001/api'
  // apiBaseURL: "https://10.1.1.28:9001/api"
  apiBaseURL: "https://10.1.0.22:9001/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

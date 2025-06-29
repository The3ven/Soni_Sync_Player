// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  videoServerBaseUrl: "http://192.168.0.184:8000",
  apiServerBaseUrl: "http://192.168.0.184:9000",
  // videoServerBaseUrl: "https://8000-the3ven-hslserver-i9eteo4tngy.ws-us118.gitpod.io",
  // apiServerBaseUrl: "https://9000-the3ven-hslserver-i9eteo4tngy.ws-us118.gitpod.io",
  apiServerPort: 9000,
  videoServerPort: 8000,
  CHAT_SERVER: "http://localhost:3000"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

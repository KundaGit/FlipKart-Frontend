// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http'; // 👈 ADD THIS

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes),
//     provideHttpClient() // 👈 ADD THIS LINE
//   ]
// };


import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 🔥 SCROLL FIX
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top', // ✅ always top
        anchorScrolling: 'enabled'        // optional (smooth anchor scroll)
      })
    ),

    provideHttpClient()
  ]
};
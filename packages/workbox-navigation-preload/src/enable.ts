/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import {logger} from 'workbox-core/_private/logger.js';
import {isSupported} from './isSupported.js';
import './_version.js';


// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

/**
 * If the browser supports Navigation Preload, then this will enable it.
 *
 * @param {string} [headerValue] Optionally, allows developers to
 * [override](https://developers.google.com/web/updates/2017/02/navigation-preload#changing_the_header)
 * the value of the `Service-Worker-Navigation-Preload` header which will be
 * sent to the server when making the navigation request.
 *
 * @memberof workbox.navigationPreload
 */
function enable(headerValue?: string) {
  if (isSupported()) {
    self.addEventListener('activate', (event: ExtendableEvent) => {
      event.waitUntil(
          self.registration.navigationPreload.enable().then(() => {
          // Defaults to Service-Worker-Navigation-Preload: true if not set.
            if (headerValue) {
              self.registration.navigationPreload.setHeaderValue(headerValue);
            }

            if (process.env.NODE_ENV !== 'production') {
              logger.log(`Navigation preload is enabled.`);
            }
          })
      );
    });
  } else {
    if (process.env.NODE_ENV !== 'production') {
      logger.log(`Navigation preload is not supported in this browser.`);
    }
  }
}

export {enable};

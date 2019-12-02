const helmet = require('helmet');

module.exports = app => {
  app.use(
    helmet({
      hidePoweredBy: { setTo: 'PHP 4.2.0' },
      frameguard: { action: 'sameorigin' },
      noCache: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", '*.gomix.com', 'glitch.com'],
          styleSrc: ["'self'"],
          scriptSrc: ["'self'", '*.jquery.com'],
        },
      },
    })
  );
};

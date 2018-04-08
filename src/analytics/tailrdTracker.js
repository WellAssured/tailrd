/* Google Analytics and autotrack.js */

const ga = window.ga;

ga('create', 'UA-116896991-1', 'auto');

ga('require', 'eventTracker');
ga('require', 'pageVisibilityTracker', {
  sendInitialPageview: true,
  visibleMetricIndex: 2,
  pageLoadsMetricIndex: 3
});
ga('require', 'mediaQueryTracker', {
  definitions: [
    {
      name: 'ResponsiveBreakpoints',
      dimensionIndex: 1,
      items: [
        {name: 'sm (<500px)', media: 'all'},
        {name: 'md (<700px)', media: '(min-width: 700px)'},
        {name: 'lg (<800px)', media: '(min-width: 800px)'},
        {name: 'xl (<1000px)', media: '(min-width: 1000px)'},
        {name: 'huge (>1000px)', media: '(max-width: 1001px)'},
      ]
    },
    {
      name: 'Orientation',
      dimensionIndex: 2,
      items: [
        {name: 'landscape', media: '(orientation: landscape)'},
        {name: 'portrait', media: '(orientation: portrait)'}        
      ]
    }
  ],
  fieldsObj: {
    nonInteraction: true
  }
});

// ga('send', 'pageview'); *** This is now handled by the `pageVisibilityTracker` plugin

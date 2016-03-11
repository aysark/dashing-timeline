# Preview
Stylish timeline widget for Dashing.io

![preview](/preview.png)

# Usage
Copy all the above files (except preview.png) and paste into corresponding locations in dashing app.  Then in your dashboard:

```html
<li data-row="1" data-col="1" data-sizex="1" data-sizey="2">
  <div data-id="a_timeline" data-view="Timeline" data-title="Timeline"></div>
</li>
```

Also we use moment.js for date formating, so be sure to include it in your layout.erb;
```html
<script type="text/javascript" src="/assets/moment.min.js"></script>
```

# Configure
Unless you want to look exactly like in the preview, you will probably want to configure the positioning and layout of the timeline chart.  This is done in the timeknots.js file.  You can also have it in horizontal mode.  

As far as data goes, its setup to take into the data from the timeline_data.yml file, but this can easily be changed in the job to fetch data from any source.

# License
MIT

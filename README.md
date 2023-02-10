# WebScraper
This project was done to study how to use puppeteer to scrape the data I need.

- install dependencies 
```ruby
  npm i
```
- start Project
```ruby
  npm run dev 
```
- build tailwind css
```ruby
  npm run build
```

## Steam Review
<p align="center">
  <img src="https://github.com/parnuphun/Give-me-i-want-it/blob/master/SteamReviewScrapeDemo.gif" width=70%>
</p>

- :link: [Example Link](https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent)

- :warning: Problem
  - When headless is false when scraping data, Chromium browser will be opened to simulate And while you are in the process of scraping that data and you close the browser it will cause an error and sometimes it won't.
  - When you export a csv file, the review field is not displayed and languages other than English are rendered incorrectly.

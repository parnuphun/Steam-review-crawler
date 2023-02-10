## Web Scraping
This project was done to study how to use puppeteer to scrape the data I need.

- Start Project
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
- Steam Review : https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent

- Problem
  - When headless is false and while scraping and you close your browser you will get an error.
  - When you export a csv file, the review field is not displayed and languages other than English are rendered incorrectly.

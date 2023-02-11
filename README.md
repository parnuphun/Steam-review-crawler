## :page_facing_up: WebScraper
This project was done to study how to use puppeteer to scrape the data I need. If you read and don't understand, yes I use Google Translate :trollface: .

## :package: Dependencies
- [puppeteer](https://pptr.dev/)
- [csv-writer](https://github.com/ryu1kn/csv-writer)

## :wrench: Configuration 
- Once `npm install` , if you have nodemon installed globally, you can npm run dev if not `npm i nodemon` in project first or globally.

- install dependencies 
```ruby
  npm install
```
- start Project 
```ruby
  npm run dev 
```
- build tailwind css
```ruby
  npm run build
```

## :speech_balloon: Steam Review
- [Example Link](https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent)
- The maximum is 1000 reviews but you can change it later. To prevent cases where there are too many reviews.
- Simulate should be set to off because there will still be an error in case of closing the browser while scraping data.
- Problem
  - When you set headless to "false", puppeteer will open a simulated browser and while you are scraping data, Did you close your browser due to unexpected events? may cause an error which occurs very often But sometimes it doesn't happen.
  - When you export a csv file, the review field is not displayed and languages other than English are rendered incorrectly.

## :pencil: Notes
### Element
- `div:nth-child(2)` The number 2 means the first item started.
- Template Type `twoSmall` , `threeSmall` , `smallFallback` , `mediumFallback`  and `largeFallback`.
- User Type `online` , `offline` and `in-game`.

### Referece
- [Infinite Scroll](https://www.youtube.com/watch?v=nDBdvqRWvCw&t=287s)
- [Click Button](https://stackoverflow.com/questions/46342930/puppeteer-button-press) 

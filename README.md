## :page_facing_up: WebScraper
This project was done to study how to use puppeteer to scrape the data I need. If you read and don't understand, yes I use Google Translate :trollface: .

- install dependencies 
```ruby
  npm install
```
- start Project (you need to install additional nodemon in case your computer doesn't install nodemon globally on your computer.)
```ruby
  npm run dev 
```
- build tailwind css
```ruby
  npm run build
```

## :speech_balloon: Steam Review
- :link: [Example Link](https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent)

- :warning: Problem
  - When you set headless to "false", puppeteer will open a simulated browser and while you are scraping data, Did you close your browser due to unexpected events? may cause an error which occurs very often But sometimes it doesn't happen.
  - When you export a csv file, the review field is not displayed and languages other than English are rendered incorrectly.

## :camera: Instragram ...

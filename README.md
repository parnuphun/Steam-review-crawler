## tools
- [Puppeteer](https://pptr.dev/)

## Template Type 
- twoSmall
- threeSmall
- smallFallback
- mediumFallback
- largeFallback

## User Status
- online
- offline
- in-game

## Selector
- check child  
```ruby
  `#page? > div`
```
- check user in row
```ruby 
  `#page_?_row_?_template_? > div`
```
- username
```ruby 
`#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div `
```
- review 
```ruby 
 `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent`
```
- date 
```ruby
`#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div`
```
- avartar
```ruby
 `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > a > div.appHubIconHolder.? > img`
```
- vote
```ruby
`#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`
```
## Notes
- div:nth-child(2) 
  - เลข 2 ระบุ user คนแรก 

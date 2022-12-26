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
  - `#page? > div`  
- check user in row
  - `#page_?_row_?_template_? > div`
- username
  - `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div `
- review 
  - `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent`
- date 
  - `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.apphub_CardTextContent > div`
- avartar
  - `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > a > div.appHubIconHolder.? > img`
- vote
  - `#page_?_row_?_template_? > div:nth-child(?) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`

## Notes
- div:nth-child(2) 
  - เลข 2 ระบุ user คนแรก 

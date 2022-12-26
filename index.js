const puppeteer = require('puppeteer')

async function scrap(){
    
    const browser = await puppeteer.launch(); // open brownser
    const page = await browser.newPage(); // open new tap 
    await page.goto('https://steamcommunity.com/app/730/reviews/?filterLanguage=all&p=1&browsefilter=mostrecent')

    let data = []
    let dataObj = {
        username: '',
        reivewPoN: '',
        reviewText: '',
        reviewDate: '',
    }

    // row per page
    const pageRowCount = await page.$$eval('#page1 > div', el => el.length)
    console.log('pageRowCount ',pageRowCount); // number 

    // * row have 2 type 
    //  1. #page_?_row_?_template_twoSmall
    //  2. #page_?_row_?_template_threeSmall

    for(let pageRowIndex = 1 ; pageRowIndex <= pageRowCount ; pageRowIndex++){

        // user per row
        //default 1. twoSmall case
        const userCount = await page.$$eval(`#page_1_row_${pageRowIndex}_template_twoSmall > div`, (el)=>{
            // in user review must be attr data-panel 
            return el.filter(el => el.hasAttribute('data-panel')).length
        }).then((result)=>{
            // 2. threeSmall Case 
            if(result === 0 || result === undefined || result === null ){
                return page.$$eval(`#page_1_row_${pageRowIndex}_template_threeSmall > div`, (el)=>{
                    return el.filter(el => el.hasAttribute('data-panel')).length
                })
            }else{
                return result
            }
        })
        // console.log(userCount);
        // loop user per col
        for(let userIndex = 1; userIndex < userCount; userIndex++){
            // loop user content (body / footer)
            // * status 
            //  1. online
            //  2. in-game 
            //  3. offline
            for(let contentIndex = 1 ; contentIndex <= 2 ; contentIndex++){
                // case 1 online (default)
                let statusSelectorCheck = `#page_1_row_1_template_twoSmall > div:nth-child(${contentIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.online.ellipsis > a:nth-child(2)`
                // chec user status
                await page.$$eval(statusSelectorCheck , el => el.length)
                    // clase 2 in-game
                    .then((result)=>{
                        if(result === 0){
                            statusSelectorCheck = `#page_1_row_1_template_twoSmall > div:nth-child(${contentIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.in-game.ellipsis > a:nth-child(2)`
                            return page.$$eval(statusSelectorCheck , el => el.length)
                            // case 3 offline
                            .then((result)=>{
                                if(result === 0){
                                    statusSelectorCheck = `#page_1_row_1_template_twoSmall > div:nth-child(${contentIndex+1}) > div.apphub_CardContentAuthorBlock.tall > div.apphub_friend_block_container > div > div.apphub_CardContentAuthorName.offline.ellipsis > a:nth-child(2)`
                                    return page.$$eval(statusSelectorCheck,el => el.length)
                                }else{
                                    return result
                                }
                            })
                        }else{
                            return result
                        }
                    })

                let waitEL = await page.waitForSelector(statusSelectorCheck)
                let text = await page.evaluate(el => el.textContent , waitEL)
                // console.log(text);
            }
        }
        
        // get vote review
        // let selector = `#page_1_row_1_template_twoSmall > div:nth-child(${userIndex+1}) > div.apphub_CardContentMain > div.apphub_UserReviewCardContent > div.vote_header > div.reviewInfo > div.thumb > img`
        // let element = await page.waitForSelector(selector)
        // let text = await page.$eval(selector, el => el.getAttribute('src'));
        // if(text.includes('thumbsUp')){
        //     text = 'positive'
        // }else if(text.includes('thumbsDown')){
        //     text = 'negative'
        // }else{
        //     text = 'cant read value'
        // }
        // console.log(text);
    }

    await browser.close() // close 
    console.log('ending');
}

function checkRowCase(page , row){

}

scrap()